const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SveltePreprocess = require('svelte-preprocess');
const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const dist = path.join(__dirname, '/app-dist');
const { version } = require('./package.json');

// @TODO eventually replace this with vite config

const electronMain = {
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
      patterns: [
        { from: path.join(__dirname, '/src/static/app') },
        {
          from: path.join(__dirname, '..', '/shared/themes'),
          to: `${dist}/themes`,
        },
        {
          from: path.join(__dirname, '..', '/shared/styles/global.css'),
          to: dist,
        },
        {
          from: path.join(__dirname, '/src/static/build'),
          to: path.join(__dirname, '/build-dist'),
        },
      ],
    }),
  ],
  devtool: prod ? false : 'source-map',
};

const electronRenderer = {
  target: 'electron-renderer',
  entry: {
    app: './src/app/main.ts',
  },
  resolve: {
    mainFields: ['svelte'],
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
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
            preprocess: SveltePreprocess({
              replace: [
                ['process.env.PLATFORM', JSON.stringify('DESKTOP')],
                ['process.env.VERSION', JSON.stringify(version)],
              ],
            }),
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
};

module.exports = [electronMain, electronRenderer];
