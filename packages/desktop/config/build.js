#!/usr/bin/node

// credit goes to @cawa-93
// https://github.com/cawa-93/vite-electron-builder/blob/main/scripts/build.js

const { build } = require('vite');
const { dirname } = require('path');

const mode = (process.env.NODE_ENV = process.env.NODE_ENV || 'production');

const packagesConfigs = [
  'config/vite.renderer.config.ts',
  'config/vite.electron.config.ts',
  'config/vite.preload.config.ts',
];

/**
 * Run `vite build` for config file
 */
const buildByConfig = (configFile) => build({ configFile, mode });
(async () => {
  try {
    const totalTimeLabel = 'Total bundling time';
    console.time(totalTimeLabel);

    for (const packageConfigPath of packagesConfigs) {
      const consoleGroupName = `${dirname(packageConfigPath)}/`;
      console.group(consoleGroupName);

      const timeLabel = 'Bundling time';
      console.time(timeLabel);

      await buildByConfig(packageConfigPath);

      console.timeEnd(timeLabel);
      console.groupEnd();
      console.log('\n'); // Just for pretty print
    }
    console.timeEnd(totalTimeLabel);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
