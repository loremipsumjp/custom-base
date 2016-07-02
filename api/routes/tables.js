'use strict';

const express = require('express')
const scaffold = require('../lib/scaffold')({ collection: 'tables' })

module.exports = factory

function factory() {
  const router = express.Router({ strict: true })

  router.get('/', findAll(), getAll())
  router.post('/', postOne())
  router.get('/:id([0-9a-f]{24})', findOne(), getOne())
  router.put('/:id([0-9a-f]{24})', findOne(), putOne())
  router.delete('/:id([0-9a-f]{24})', findOne(), deleteOne())
  router.get('/find-by-key/:key', findOneByKey(), getOne())

  return router
}

function getAll() {
  return scaffold.getAll()
}

function postOne() {
  return scaffold.postOne()
}

function getOne() {
  return scaffold.getOne()
}

function putOne() {
  return scaffold.putOne()
}

function deleteOne() {
  return scaffold.deleteOne()
}

function findOne() {
  return scaffold.findOne()
}

function findOneByKey() {
  return scaffold.findOneByKey()
}

function findAll() {
  return scaffold.findAll()
}
