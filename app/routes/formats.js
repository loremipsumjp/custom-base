'use strict';

const express = require('express')
const scaffold = require('../lib/scaffold')({ collection: 'formats' })

module.exports = {
  private: {
    html: privateHtml,
  },
}

function privateHtml() {
  const router = express.Router({ strict: true })

  router.get('/add/', privateHtmlAdd())
  router.get('/:id([0-9a-f]{24})/', privateHtmlFindOne(), privateHtmlDetail())
  router.get('/:id([0-9a-f]{24})/copy/', privateHtmlFindOne(), privateHtmlCopy())
  router.get('/:id([0-9a-f]{24})/edit/', privateHtmlFindOne(), privateHtmlEdit())
  router.get('/:id([0-9a-f]{24})/delete/', privateHtmlFindOne(), privateHtmlDelete())

  return router
}

function privateHtmlAdd() {
  return function (req, res) {
    res.render('formats/private-add')
  }
}

function privateHtmlDetail() {
  return function (req, res) {
    res.render('formats/private-detail')
  }
}

function privateHtmlCopy() {
  return function (req, res) {
    res.render('formats/private-copy')
  }
}

function privateHtmlEdit() {
  return function (req, res) {
    res.render('formats/private-edit')
  }
}

function privateHtmlDelete() {
  return function (req, res) {
    res.render('formats/private-delete')
  }
}

function privateHtmlFindOne() {
  return scaffold.findOne()
}
