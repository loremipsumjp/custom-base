'use strict'

const Q = require('q')
const co = require('co')
const bcrypt = require('bcryptjs')

module.exports = factory

function factory() {
  return function (req, res, next) {
    co(function *() {
      if (req.method === 'POST' || req.method === 'PUT') {
        if (typeof req.body.password === 'string') {
          req.body.password = yield Q.nfcall(bcrypt.hash, req.body.password, 10)
        }
      }

      return next()
    })
      .catch(next)
  }
}
