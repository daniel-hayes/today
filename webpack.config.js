const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SveltePreprocess = require('svelte-preprocess');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const dist = path.join(__dirname, '/dist');

module.exports = [
  {
    target: 'electron-main',
    entry: {
      index: './src/electron/main.ts',
      preload: './src/electron/preload.ts',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      path: dist,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    mode,
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: './src/static' }],
      }),
    ],
    devtool: prod ? false : 'source-map',
  },
  {
    target: 'electron-renderer',
    entry: {
      app: './src/app/main.ts',
    },
    resolve: {
      extensions: ['.svelte', '.ts', '.js'],
    },
    output: {
      path: dist,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.svelte$/,
          exclude: /node_modules/,
          use: {
            loader: 'svelte-loader',
            options: {
              compilerOptions: {
                dev: !prod,
              },
              emitCss: true,
              preprocess: SveltePreprocess(),
            },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          // required to prevent errors from Svelte on Webpack 5+
          test: /node_modules\/svelte\/.*\.mjs$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    mode,
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
    devtool: prod ? false : 'source-map',
  },
];
