'use strict';

const env = process.env.NODE_ENV || 'development'

const url = require('url')
const path = require('path')
const co = require('co')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const serveStatic = require('serve-static')
const MongoClient = require('mongodb').MongoClient
const proxyMiddleware = require('proxy-middleware')
const RedisStore = require('connect-redis')(session)

const auth = require('./routes/auth')
const files = require('./routes/files')
const pages = require('./routes/pages')
const tools = require('./routes/tools')
const tables = require('./routes/tables')
const columns = require('./routes/columns')
const formats = require('./routes/formats')
const storage = require('./routes/storage')
const reports = require('./routes/reports')
const profiles = require('./routes/profiles')
const settings = require('./routes/settings')
const dashboards = require('./routes/dashboards')
const staticPages = require('./routes/static-pages')
const customObjects = require('./routes/custom-objects')
const proxy = require('./lib/proxy')

const apiConfig = require('./config/api')[env]
const siteConfig = require('./config/site')[env]
const redisConfig = require('./config/redis')[env]
const cookieConfig = require('./config/cookie')[env]
const mongodbConfig = require('./config/mongodb')[env]
const sessionConfig = require('./config/session')[env]
const storageConfig = require('./config/storage')[env]

module.exports = factory

function *factory() {
  const app = express()

  app.set('views', path.join(__dirname, './views/'))
  app.set('view engine', 'jade')
  app.set('strict routing', true)

  app.use(morgan('dev'))
  app.use(session({
    cookie: cookieConfig,
    name: sessionConfig.name,
    proxy: sessionConfig.proxy,
    resave: sessionConfig.resave,
    rolling: sessionConfig.rolling,
    saveUninitialized: sessionConfig.saveUninitialized,
    secret: sessionConfig.secret,
    store: new RedisStore(redisConfig),
    unset: sessionConfig.unset,
  }))

  const db = yield MongoClient.connect(mongodbConfig.url)

  app.use(function (req, res, next) {
    req.db = db
    req.locals = {}
    req.locals.baseUrl = res.locals.baseUrl = siteConfig.baseUrl
    req.locals.session = res.locals.session = req.session

    return next()
  })

  app.get('/', staticPages.public.top())
  app.use('/public/auth', auth.public.html())
  app.use('/public/api/v1/auth', bodyParser.json(), auth.public.api())

  app.use('/private', auth.private.authenticate({ redirect: `${siteConfig.baseUrl}/public/auth/login/?status=unauthorized` }))
  app.use('/private', auth.private.authorize())
  app.get('/private/', staticPages.private.home())
  app.use('/private/auth', auth.private.html())
  app.use('/private/files', files.private.html())
  app.use('/private/tools', tools.private.html())
  app.use('/private/tables', tables.private.html())
  app.use('/private/tables/:tableId([0-9a-f]{24})', tables.private.findOne())
  app.use('/private/tables/:tableId([0-9a-f]{24})/pages', pages.private.html())
  app.use('/private/tables/:tableId([0-9a-f]{24})/columns', columns.private.html())
  app.use('/private/tables/:tableId([0-9a-f]{24})/formats', formats.private.html())
  app.use('/private/reports', reports.private.html())
  app.use('/private/storage', onStorage())
  app.use('/private/profiles', profiles.private.html())
  app.use('/private/settings', settings.private.html())
  app.use('/private/dashboards', dashboards.private.html())
  app.use('/private/custom-objects/:tableKey', customObjects.private.html())

  app.use('/private/api/v1/auth', bodyParser.json(), auth.private.api())
  app.use('/private/api/v1/storage', bodyParser.json(), storage.private.api())
  app.use('/private/api/v1', onApi())

  app.use('/static', onStatic())
  app.use(onNotFound())
  app.use(onError())

  return app
}

function onStorage() {
  return proxyMiddleware(url.parse(storageConfig.url))
}

function onApi() {
  return proxy(apiConfig.options)
}

function onStatic() {
  if (env === 'development') {
    return proxyMiddleware(url.parse('http://127.0.0.1:8080/'))
  } else if (env === 'production') {
    return serveStatic(path.join(__dirname, '../static/dist/'))
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
