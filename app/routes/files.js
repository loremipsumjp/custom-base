'use strict';

const express = require('express')
const scaffold = require('../lib/scaffold')({ collection: 'files' })

module.exports = {
  private: {
    html: privateHtml,
  },
}

function privateHtml() {
  const router = express.Router({ strict: true })

  router.get('/', privateHtmlIndex())
  router.get('/add/', privateHtmlAdd())
  router.get('/:id([0-9a-f]{24})/', privateHtmlFindOne(), privateHtmlDetail())
  router.get('/:id([0-9a-f]{24})/copy/', privateHtmlFindOne(), privateHtmlCopy())
  router.get('/:id([0-9a-f]{24})/edit/', privateHtmlFindOne(), privateHtmlEdit())
  router.get('/:id([0-9a-f]{24})/delete/', privateHtmlFindOne(), privateHtmlDelete())

  return router
}

function privateHtmlIndex() {
  return function (req, res) {
    res.render('files/private-index')
  }
}

function privateHtmlAdd() {
  return function (req, res) {
    res.render('files/private-add')
  }
}

function privateHtmlDetail() {
  return function (req, res) {
    res.render('files/private-detail')
  }
}

function privateHtmlCopy() {
  return function (req, res) {
    res.render('files/private-copy')
  }
}

function privateHtmlEdit() {
  return function (req, res) {
    res.render('files/private-edit')
  }
}

function privateHtmlDelete() {
  return function (req, res) {
    res.render('files/private-delete')
  }
}

function privateHtmlFindOne() {
  return scaffold.findOne()
}
