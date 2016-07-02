'use strict';

const co = require('co')
const express = require('express')
const ObjectId = require('mongodb').ObjectId
const scaffold = require('../lib/scaffold')({ collection: 'tables' })

module.exports = {
  private: {
    html: privateHtml,
    findOne: privateFindOne,
  },
}

function privateHtml() {
  const router = express.Router({ strict: true })

  router.get('/', privateHtmlIndex())
  router.get('/add/', privateHtmlAdd())
  router.get('/:id([0-9a-z]{24})/', privateHtmlFindOne(), privateHtmlDetail())
  router.get('/:id([0-9a-z]{24})/copy/', privateHtmlFindOne(), privateHtmlCopy())
  router.get('/:id([0-9a-z]{24})/edit/', privateHtmlFindOne(), privateHtmlEdit())
  router.get('/:id([0-9a-z]{24})/delete/', privateHtmlFindOne(), privateHtmlDelete())

  return router
}

function privateHtmlIndex() {
  return function (req, res) {
    res.render('tables/private-index')
  }
}

function privateHtmlAdd() {
  return function (req, res) {
    res.render('tables/private-add')
  }
}

function privateHtmlDetail() {
  return function (req, res) {
    res.render('tables/private-detail')
  }
}

function privateHtmlCopy() {
  return function (req, res) {
    res.render('tables/private-copy')
  }
}

function privateHtmlEdit() {
  return function (req, res) {
    res.render('tables/private-edit')
  }
}

function privateHtmlDelete() {
  return function (req, res) {
    res.render('tables/private-delete')
  }
}

function privateHtmlFindOne() {
  return scaffold.findOne()
}

function privateFindOne() {
  return function (req, res, next) {
    co(function *() {
      const tableId = req.params.tableId
      const collection = req.db.collection('tables')
      const table = yield collection.findOne({ _id: new ObjectId(tableId) })

      if (table === null) {
        const err = new Error('not found')
        err.status = 404

        return next(err)
      }

      req.locals.table = res.locals.table = table

      return next()
    })
      .catch(next)
  }
}
