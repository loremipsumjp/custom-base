'use strict';

const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: ['babel-polyfill', './src/entry.js'],
  output: {
    path: path.join(__dirname, './dist/'),
    filename: 'js/bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-3'],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('development'),
    }),
  ],
}
