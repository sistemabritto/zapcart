const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');

/**
 * Manages IDE configuration persistence
 * Saves and loads IDE-specific configurations to/from evo/_config/ides/
 */
class IdeConfigManager {
  constructor() {}

  /**
   * Get path to IDE config directory
   * @param {string} evoDir - EVO installation directory
   * @returns {string} Path to IDE config directory
   */
  getIdeConfigDir(evoDir) {
    return path.join(evoDir, '_config', 'ides');
  }

  /**
   * Get path to specific IDE config file
   * @param {string} evoDir - EVO installation directory
   * @param {string} ideName - IDE name (e.g., 'claude-code')
   * @returns {string} Path to IDE config file
   */
  getIdeConfigPath(evoDir, ideName) {
    return path.join(this.getIdeConfigDir(evoDir), `${ideName}.yaml`);
  }

  /**
   * Save IDE configuration
   * @param {string} evoDir - EVO installation directory
   * @param {string} ideName - IDE name
   * @param {Object} configuration - IDE-specific configuration object
   */
  async saveIdeConfig(evoDir, ideName, configuration) {
    const configDir = this.getIdeConfigDir(evoDir);
    await fs.ensureDir(configDir);

    const configPath = this.getIdeConfigPath(evoDir, ideName);
    const now = new Date().toISOString();

    // Check if config already exists to preserve configured_date
    let configuredDate = now;
    if (await fs.pathExists(configPath)) {
      try {
        const existing = await this.loadIdeConfig(evoDir, ideName);
        if (existing && existing.configured_date) {
          configuredDate = existing.configured_date;
        }
      } catch {
        // Ignore errors reading existing config
      }
    }

    const configData = {
      ide: ideName,
      configured_date: configuredDate,
      last_updated: now,
      configuration: configuration || {},
    };

    // Clean the config to remove any non-serializable values (like functions)
    const cleanConfig = structuredClone(configData);

    const yamlContent = yaml.stringify(cleanConfig, {
      indent: 2,
      lineWidth: 0,
      sortKeys: false,
    });

    // Ensure POSIX-compliant final newline
    const content = yamlContent.endsWith('\n') ? yamlContent : yamlContent + '\n';
    await fs.writeFile(configPath, content, 'utf8');
  }

  /**
   * Load IDE configuration
   * @param {string} evoDir - EVO installation directory
   * @param {string} ideName - IDE name
   * @returns {Object|null} IDE configuration or null if not found
   */
  async loadIdeConfig(evoDir, ideName) {
    const configPath = this.getIdeConfigPath(evoDir, ideName);

    if (!(await fs.pathExists(configPath))) {
      return null;
    }

    try {
      const content = await fs.readFile(configPath, 'utf8');
      const config = yaml.parse(content);
      return config;
    } catch (error) {
      await prompts.log.warn(`Failed to load IDE config for ${ideName}: ${error.message}`);
      return null;
    }
  }

  /**
   * Load all IDE configurations
   * @param {string} evoDir - EVO installation directory
   * @returns {Object} Map of IDE name to configuration
   */
  async loadAllIdeConfigs(evoDir) {
    const configDir = this.getIdeConfigDir(evoDir);
    const configs = {};

    if (!(await fs.pathExists(configDir))) {
      return configs;
    }

    try {
      const files = await fs.readdir(configDir);
      for (const file of files) {
        if (file.endsWith('.yaml')) {
          const ideName = file.replace('.yaml', '');
          const config = await this.loadIdeConfig(evoDir, ideName);
          if (config) {
            configs[ideName] = config.configuration;
          }
        }
      }
    } catch (error) {
      await prompts.log.warn(`Failed to load IDE configs: ${error.message}`);
    }

    return configs;
  }

  /**
   * Check if IDE has saved configuration
   * @param {string} evoDir - EVO installation directory
   * @param {string} ideName - IDE name
   * @returns {boolean} True if configuration exists
   */
  async hasIdeConfig(evoDir, ideName) {
    const configPath = this.getIdeConfigPath(evoDir, ideName);
    return await fs.pathExists(configPath);
  }

  /**
   * Delete IDE configuration
   * @param {string} evoDir - EVO installation directory
   * @param {string} ideName - IDE name
   */
  async deleteIdeConfig(evoDir, ideName) {
    const configPath = this.getIdeConfigPath(evoDir, ideName);
    if (await fs.pathExists(configPath)) {
      await fs.remove(configPath);
    }
  }
}

module.exports = { IdeConfigManager };
