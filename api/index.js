'use strict';

const env = process.env.NODE_ENV || 'development'

const url = require('url')
const path = require('path')
const co = require('co')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoClient = require('mongodb').MongoClient
const proxyMiddleware = require('proxy-middleware')

const files = require('./routes/files')
const pages = require('./routes/pages')
const tools = require('./routes/tools')
const tables = require('./routes/tables')
const columns = require('./routes/columns')
const formats = require('./routes/formats')
const reports = require('./routes/reports')
const profiles = require('./routes/profiles')
const settings = require('./routes/settings')
const dashboards = require('./routes/dashboards')
const customObjects = require('./routes/custom-objects')

const mongodbConfig = require('./config/mongodb')[env]

module.exports = factory

function *factory() {
  const app = express()

  app.set('strict routing', true)

  app.use(morgan('dev'))
  app.use(bodyParser.json())

  const db = yield MongoClient.connect(mongodbConfig.url)

  app.use(function (req, res, next) {
    co(function *() {
      req.db = db
      req.locals = {}

      return next()
    })
  })

  app.get('/', onRoot())
  app.use('/files', files())
  app.use('/pages', pages())
  app.use('/tools', tools())
  app.use('/tables', tables())
  app.use('/columns', columns())
  app.use('/formats', formats())
  app.use('/reports', reports())
  app.use('/profiles', profiles())
  app.use('/settings', settings())
  app.use('/dashboards', dashboards())
  app.use('/custom-objects/:tableKey', customObjects())

  app.use(onNotFound())
  app.use(onError())

  return app
}

function onRoot() {
  return function (req, res, next) {
    res.send({ status: 'OK' })
  }
}

function onNotFound() {
  return function (req, res, next) {
    const err = new Error('not found')
    err.status = 404
    return next(err)
  }
}

function onError() {
  return function (err, req, res, next) {
    res.status(err.status || 500).send({
      status: 'error',
      message: err.message,
    })

    if (env === 'development') {
      console.error(err.stack)
    }
  }
}
