'use strict';

const Q = require('q')
const co = require('co')
const bcrypt = require('bcryptjs')
const express = require('express')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  public: {
    api: publicApi,
    html: publicHtml,
  },
  private: {
    api: privateApi,
    html: privateHtml,
    authenticate: privateAuthenticate,
    authorize: privateAuthorize,
  },
}

function publicApi() {
  const router = express.Router({ strict: true })

  router.put('/login', publicApiLogin())

  return router
}

function publicHtml() {
  const router = express.Router({ strict: true })

  router.get('/login/', publicHtmlLogin())

  return router
}

function privateApi() {
  const router = express.Router({ strict: true })

  router.put('/logout', privateApiLogout())
  router.put('/password', privateApiPassword())

  return router
}

function privateHtml() {
  const router = express.Router({ strict: true })

  router.get('/logout/', privateHtmlLogout())
  router.get('/password/', privateHtmlPassword())

  return router
}

function privateAuthenticate({ redirect }) {
  return function (req, res, next) {
    co(function *() {
      if (typeof req.session.user === 'undefined') {
        return res.redirect(redirect)
      }

      const userId = req.session.user._id
      const user = yield req.db.collection('users').findOne({ _id: new ObjectId(userId) })

      if (user === null) {
        return next(new Error('invalid user id: ' + userId))
      }

      req.locals.user = res.locals.user = user

      const profileId = user.profileId
      const profile = yield req.db.collection('profiles').findOne({ _id: new ObjectId(profileId) })
      
      if (profile === null) {
        return next(new Error('invalid profile id: ' + profileId))
      }

      req.locals.profile = res.locals.profile = profile

      return next()
    })
      .catch(next)
  }
}

function privateAuthorize() {
  return function (req, res, next) {
    const statements = req.locals.profile.policy.statements.filter(statement => {
      if (statement.method !== '*') {
        const methods = statement.method.split(',')

        if (methods.indexOf(req.method) === -1) {
          return false
        }
      }

      return new RegExp(statement.url.regexp).test(req.originalUrl)
    })
    
    if (statements.length >= 1 && statements[statements.length - 1].effect === 'allow') {
      return next()
    } else {
      const err = new Error('forbidden')
      err.status = 403
      return next(err)
    }
  }
}

function publicApiLogin() {
  return function (req, res, next) {
    co(function *() {
      const username = req.body.username
      const password = req.body.password

      const user = yield req.db.collection('users').findOne({ username: username })

      if (user === null) {
        const err = new Error('invalid credentials')
        err.status = 400
        return next(err)
      }

      const matched = yield Q.nfcall(bcrypt.compare, password, user.password)

      if (!matched) {
        const err = new Error('invalid credentials')
        err.status = 400
        return next(err)
      }

      req.session.user = { _id: user._id }
      res.status(204).end()
    })
      .catch(next)
  }
}

function publicHtmlLogin() {
  return function (req, res, next) {
    res.render('auth/public-login')
  }
}

function privateApiLogout() {
  return function (req, res, next) {
    delete req.session.user
    res.status(204).end()
  }
}

function privateApiPassword() {
  return function (req, res, next) {
    return next(new Error('not implemented'))
  }
}

function privateHtmlLogout() {
  return function (req, res, next) {
    res.render('auth/private-logout')
  }
}

function privateHtmlPassword() {
  return function (req, res, next) {
    res.render('auth/private-password')
  }
}
