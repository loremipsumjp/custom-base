'use strict';

const url = require('url')
const co = require('co')
const express = require('express')

module.exports = {
  private: {
    html: privateHtml,
  },
}

function privateHtml() {
  return [
    privateHtmlFindTable(),
    privateHtmlTry(),
  ]
}

function privateHtmlFindTable() {
  return function (req, res, next) {
    co(function *() {
      const tableKey = req.params.tableKey
      const table = yield req.db.collection('tables').findOne({ key: tableKey })

      if (table === null) {
        return next(new Error(`invald table key: ${tableKey}`))
      }

      req.locals.table = res.locals.table = table
      return next()
    })
      .catch(next)
  }
}

function privateHtmlTry() {
  return function (req, res, next) {
    co(function *() {
      if (req.locals.table === null) {
        return next()
      }

      const pathname = url.parse(req.url).pathname
      const query = {
        tableId: req.locals.table._id.toString(),
        type: { $not: /^abstract$/ },
      }

      const pages = (yield req.db.collection('pages').find(query).toArray())
        .filter(page => {
          if (page.path === '/') {
            return new RegExp('^/$').test(pathname)
          } else if (page.path === '/:id/') {
            return new RegExp('^/[0-9a-f]{24}/$').test(pathname)
          } else if (page.path === '/:key/') {
            return new RegExp(`^/${page.key}/$`).test(pathname)
          } else if (page.path === '/:id/:key/') {
            return new RegExp(`^/[0-9a-f]{24}/${page.key}/`).test(pathname)
          }
        })

      if (pages.length === 0) {
        return next()
      }

      const page = pages.slice(1).reduce((memo, page) => {
        return (memo.path === '/:id/' && page.path === '/:key/') ? page : memo
      }, pages[0])

      req.locals.page = res.locals.page = page

      res.render(`custom-objects/private-try-${page.layout}`)
    })
      .catch(next)
  }
}
