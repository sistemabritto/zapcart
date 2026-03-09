const path = require('node:path');
const prompts = require('../lib/prompts');
const { Installer } = require('../installers/lib/core/installer');
const { Manifest } = require('../installers/lib/core/manifest');
const { UI } = require('../lib/ui');

const installer = new Installer();
const manifest = new Manifest();
const ui = new UI();

module.exports = {
  command: 'status',
  description: 'Display EVO installation status and module versions',
  options: [],
  action: async (options) => {
    try {
      // Find the evo directory
      const projectDir = process.cwd();
      const { evoDir } = await installer.findEvoDir(projectDir);

      // Check if evo directory exists
      const fs = require('fs-extra');
      if (!(await fs.pathExists(evoDir))) {
        await prompts.log.warn('No EVO installation found in the current directory.');
        await prompts.log.message(`Expected location: ${evoDir}`);
        await prompts.log.message('Run "evo install" to set up a new installation.');
        process.exit(0);
        return;
      }

      // Read manifest
      const manifestData = await manifest._readRaw(evoDir);

      if (!manifestData) {
        await prompts.log.warn('No EVO installation manifest found.');
        await prompts.log.message('Run "evo install" to set up a new installation.');
        process.exit(0);
        return;
      }

      // Get installation info
      const installation = manifestData.installation || {};
      const modules = manifestData.modules || [];

      // Check for available updates (only for external modules)
      const availableUpdates = await manifest.checkForUpdates(evoDir);

      // Display status
      await ui.displayStatus({
        installation,
        modules,
        availableUpdates,
        evoDir,
      });

      process.exit(0);
    } catch (error) {
      await prompts.log.error(`Status check failed: ${error.message}`);
      if (process.env.EVO_DEBUG) {
        await prompts.log.message(error.stack);
      }
      process.exit(1);
    }
  },
};
