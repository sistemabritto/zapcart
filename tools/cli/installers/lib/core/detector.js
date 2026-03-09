const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { Manifest } = require('./manifest');

class Detector {
  /**
   * Detect existing EVO installation
   * @param {string} evoDir - Path to evo directory
   * @returns {Object} Installation status and details
   */
  async detect(evoDir) {
    const result = {
      installed: false,
      path: evoDir,
      version: null,
      hasCore: false,
      modules: [],
      ides: [],
      customModules: [],
      manifest: null,
    };

    // Check if evo directory exists
    if (!(await fs.pathExists(evoDir))) {
      return result;
    }

    // Check for manifest using the Manifest class
    const manifest = new Manifest();
    const manifestData = await manifest.read(evoDir);
    if (manifestData) {
      result.manifest = manifestData;
      result.version = manifestData.version;
      result.installed = true;
      // Copy custom modules if they exist
      if (manifestData.customModules) {
        result.customModules = manifestData.customModules;
      }
    }

    // Check for core
    const corePath = path.join(evoDir, 'core');
    if (await fs.pathExists(corePath)) {
      result.hasCore = true;

      // Try to get core version from config
      const coreConfigPath = path.join(corePath, 'config.yaml');
      if (await fs.pathExists(coreConfigPath)) {
        try {
          const configContent = await fs.readFile(coreConfigPath, 'utf8');
          const config = yaml.parse(configContent);
          if (!result.version && config.version) {
            result.version = config.version;
          }
        } catch {
          // Ignore config read errors
        }
      }
    }

    // Check for modules
    // If manifest exists, use it as the source of truth for installed modules
    // Otherwise fall back to directory scanning (legacy installations)
    if (manifestData && manifestData.modules && manifestData.modules.length > 0) {
      // Use manifest module list - these are officially installed modules
      for (const moduleId of manifestData.modules) {
        const modulePath = path.join(evoDir, moduleId);
        const moduleConfigPath = path.join(modulePath, 'config.yaml');

        const moduleInfo = {
          id: moduleId,
          path: modulePath,
          version: 'unknown',
        };

        if (await fs.pathExists(moduleConfigPath)) {
          try {
            const configContent = await fs.readFile(moduleConfigPath, 'utf8');
            const config = yaml.parse(configContent);
            moduleInfo.version = config.version || 'unknown';
            moduleInfo.name = config.name || moduleId;
            moduleInfo.description = config.description;
          } catch {
            // Ignore config read errors
          }
        }

        result.modules.push(moduleInfo);
      }
    } else {
      // Fallback: scan directory for modules (legacy installations without manifest)
      const entries = await fs.readdir(evoDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'core' && entry.name !== '_config') {
          const modulePath = path.join(evoDir, entry.name);
          const moduleConfigPath = path.join(modulePath, 'config.yaml');

          // Only treat it as a module if it has a config.yaml
          if (await fs.pathExists(moduleConfigPath)) {
            const moduleInfo = {
              id: entry.name,
              path: modulePath,
              version: 'unknown',
            };

            try {
              const configContent = await fs.readFile(moduleConfigPath, 'utf8');
              const config = yaml.parse(configContent);
              moduleInfo.version = config.version || 'unknown';
              moduleInfo.name = config.name || entry.name;
              moduleInfo.description = config.description;
            } catch {
              // Ignore config read errors
            }

            result.modules.push(moduleInfo);
          }
        }
      }
    }

    // Check for IDE configurations from manifest
    if (result.manifest && result.manifest.ides) {
      // Filter out any undefined/null values
      result.ides = result.manifest.ides.filter((ide) => ide && typeof ide === 'string');
    }

    // Mark as installed if we found core or modules
    if (result.hasCore || result.modules.length > 0) {
      result.installed = true;
    }

    return result;
  }

  /**
   * Detect legacy installation (_evo-method, .bmm, .cis)
   * @param {string} projectDir - Project directory to check
   * @returns {Object} Legacy installation details
   */
  async detectLegacy(projectDir) {
    const result = {
      hasLegacy: false,
      legacyCore: false,
      legacyModules: [],
      paths: [],
    };

    // Check for legacy core (_evo-method)
    const legacyCorePath = path.join(projectDir, '_evo-method');
    if (await fs.pathExists(legacyCorePath)) {
      result.hasLegacy = true;
      result.legacyCore = true;
      result.paths.push(legacyCorePath);
    }

    // Check for legacy modules (directories starting with .)
    const entries = await fs.readdir(projectDir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        entry.name.startsWith('.') &&
        entry.name !== '_evo-method' &&
        !entry.name.startsWith('.git') &&
        !entry.name.startsWith('.vscode') &&
        !entry.name.startsWith('.idea')
      ) {
        const modulePath = path.join(projectDir, entry.name);
        const moduleManifestPath = path.join(modulePath, 'install-manifest.yaml');

        // Check if it's likely a EVO module
        if ((await fs.pathExists(moduleManifestPath)) || (await fs.pathExists(path.join(modulePath, 'config.yaml')))) {
          result.hasLegacy = true;
          result.legacyModules.push({
            name: entry.name.slice(1), // Remove leading dot
            path: modulePath,
          });
          result.paths.push(modulePath);
        }
      }
    }

    return result;
  }

  /**
   * Check if migration from legacy is needed
   * @param {string} projectDir - Project directory
   * @returns {Object} Migration requirements
   */
  async checkMigrationNeeded(projectDir) {
    const evoDir = path.join(projectDir, 'evo');
    const current = await this.detect(evoDir);
    const legacy = await this.detectLegacy(projectDir);

    return {
      needed: legacy.hasLegacy && !current.installed,
      canMigrate: legacy.hasLegacy,
      legacy: legacy,
      current: current,
    };
  }

  /**
   * Detect legacy EVO v4 .evo-method folder
   * @param {string} projectDir - Project directory to check
   * @returns {{ hasLegacyV4: boolean, offenders: string[] }}
   */
  async detectLegacyV4(projectDir) {
    const offenders = [];

    // Check for .evo-method folder
    const evoMethodPath = path.join(projectDir, '.evo-method');
    if (await fs.pathExists(evoMethodPath)) {
      offenders.push(evoMethodPath);
    }

    return { hasLegacyV4: offenders.length > 0, offenders };
  }
}

module.exports = { Detector };
