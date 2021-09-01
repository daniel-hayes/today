import path from 'path';
import { builtinModules } from 'module';

const PACKAGE_ROOT = path.join(__dirname, '..');
const ELECTRON_ROOT = path.join(PACKAGE_ROOT, 'src/electron');

const config = {
  mode: process.env.NODE_ENV,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  build: {
    sourcemap: 'inline',
    target: `chrome91`,
    outDir: `${PACKAGE_ROOT}/app-dist`,
    assetsDir: '.',
    minify: process.env.NODE_ENV === 'development' ? false : 'terser',
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    lib: {
      entry: `${ELECTRON_ROOT}/preload.ts`,
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron', ...builtinModules],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: false,
    brotliSize: false,
  },
};

export default config;
