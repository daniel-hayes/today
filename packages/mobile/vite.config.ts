import { defineConfig } from 'vite';
import path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import copy from 'rollup-plugin-copy';
import { version } from './package.json';

const SHARED_ROOT = path.join(__dirname, '..', 'shared');

export default defineConfig({
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
          dest: './public/',
        },
      ],
    }),
  ],
  build: {
    outDir: './public',
    emptyOutDir: false,
  },
  server: {
    fs: {
      strict: true,
    },
  },
});
