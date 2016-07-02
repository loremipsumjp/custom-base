'use strict';

const env = process.env.NODE_ENV || 'development'

const url = require('url')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const auth = require('./lib/auth')
const proxy = require('./lib/proxy')
const created = require('./lib/created')
const updated = require('./lib/updated')
const password = require('./lib/password')

const apiConfig = require('./config/api')[env]

module.exports = factory

function *factory() {
  const app = express()

  app.set('strict routing', true)

  app.use(morgan('dev'))
  app.use(bodyParser.json())

  app.use(function (req, res, next) {
    req.locals = {}

    next()
  })

  app.use('/', auth())
  app.use('/custom-objects/:tableKey', created())
  app.use('/custom-objects/:tableKey', updated())
  app.use('/custom-objects/users', password())
  app.use(onApi())
  app.use(onError())

  return app
}

function onApi() {
  return proxy(apiConfig.options)
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
