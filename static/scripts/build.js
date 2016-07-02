'use strict';

const path = require('path')
const Q = require('q')
const co = require('co')
const cpr = require('cpr')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config')

if (require.main === module) {
  main()
}

function main() {
  co(function *() {
    yield taskCopy()
    yield taskWebpack()
  })
    .catch(err => console.error(err.stack))
}

function *taskCopy() {
  const src = path.join(__dirname, '../public/')
  const dest = path.join(__dirname, '../dist/')

  yield Q.nfcall(cpr, src, dest)
}

function *taskWebpack() {
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin(),
  ])

  yield Q.nfcall(webpack, webpackConfig)
}
