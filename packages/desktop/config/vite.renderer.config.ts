import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import preprocess from 'svelte-preprocess';
import { builtinModules } from 'module';
import { version } from '../package.json';

const PACKAGE_ROOT = path.join(__dirname, '..');
const APP_ROOT = path.join(PACKAGE_ROOT, 'src/app');
const SHARED_ROOT = path.join(__dirname, '../../', 'shared');

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    entry.isDirectory()
      ? copyDirectory(sourcePath, destinationPath)
      : fs.copyFileSync(sourcePath, destinationPath);
  });
}

const config = {
  mode: process.env.NODE_ENV,
  envDir: PACKAGE_ROOT,
  root: APP_ROOT,
  plugins: [
    svelte({
      preprocess: preprocess({
        replace: [
          ['process.env.PLATFORM', JSON.stringify('DESKTOP')],
          ['process.env.VERSION', JSON.stringify(version)],
        ],
      }),
    }),
    copyDirectory(`${SHARED_ROOT}/themes/`, `${PACKAGE_ROOT}/app-dist/themes`),
    copyDirectory(
      `${PACKAGE_ROOT}/src/resources/`,
      `${PACKAGE_ROOT}/build-dist/`
    ),
  ],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    // only need on dev
    sourcemap: true,
    target: `chrome91`,
    outDir: `${PACKAGE_ROOT}/app-dist`,
    assetsDir: '.',
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    rollupOptions: {
      external: [...builtinModules],
    },
    emptyOutDir: false,
    brotliSize: false,
  },
};

export default config;
