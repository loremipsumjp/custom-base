'use strict';

const express = require('express')
const scaffold = require('../lib/scaffold')({ collection: 'settings' })

module.exports = {
  private: {
    html: privateHtml,
  },
}

function privateHtml() {
  const router = express.Router({ strict: true })

  router.get('/', privateHtmlIndex())
  router.get('/:id([0-9a-f]{24})/edit/', privateHtmlFindOne(), privateHtmlEdit())

  return router
}

function privateHtmlIndex() {
  return function (req, res) {
    res.render('settings/private-index')
  }
}

function privateHtmlEdit() {
  return function (req, res) {
    res.render('settings/private-edit')
  }
}

function privateHtmlFindOne() {
  return scaffold.findOne()
}
