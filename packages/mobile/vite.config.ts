import { defineConfig } from 'vite';
import { getAliases } from 'vite-aliases';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import { version } from './package.json';

const aliases = getAliases();

// https://vitejs.dev/config/
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
  ],
  publicDir: './assets/',
  build: {
    outDir: './public/',
  },
  resolve: {
    alias: aliases,
  },
});
