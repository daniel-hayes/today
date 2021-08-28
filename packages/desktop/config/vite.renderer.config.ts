import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import copy from 'rollup-plugin-copy';
import preprocess from 'svelte-preprocess';
import { builtinModules } from 'module';
import { version } from '../package.json';

const PACKAGE_ROOT = path.join(__dirname, '..');
const APP_ROOT = path.join(PACKAGE_ROOT, 'src/app');
const SHARED_ROOT = path.join(__dirname, '../../', 'shared');

const config = {
  mode: process.env.MODE,
  root: APP_ROOT,
  plugins: [
    svelte({
      preprocess: preprocess({
        replace: [
          ['process.env.PLATFORM', JSON.stringify('MOBILE')],
          ['process.env.VERSION', JSON.stringify(version)],
        ],
      }),
    }),
    copy({
      targets: [
        {
          src: `${SHARED_ROOT}/themes`,
          dest: `${PACKAGE_ROOT}/app-dist`,
        },
        {
          src: `${PACKAGE_ROOT}/src/static/build`,
          dest: `${PACKAGE_ROOT}/build-dist`,
        },
      ],
    }),
  ],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
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
