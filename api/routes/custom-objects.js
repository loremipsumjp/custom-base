'use strict';

const url = require('url')
const co = require('co')
const express = require('express')
const ObjectId = require('mongodb').ObjectId

module.exports = factory

function factory() {
  return [
    findTable(),
    route(),
  ]
}

function findTable() {
  return function (req, res, next) {
    co(function *() {
      const table = yield req.db.collection('tables').findOne({ key: req.params.tableKey })
      const columns = table === null ? [] : yield req.db.collection('columns')
        .find({ tableId: table._id.toString() })
        .sort({ index: 1 })
        .toArray()

      req.locals.table = res.locals.table = table
      req.locals.columns = res.locals.columns = columns

      return next()
    })
      .catch(next)
  }
}

function route() {
  const router = express.Router({ strict: true })

  router.get('/', findAll(), getAll())
  router.post('/', postOne())
  router.get('/:id([0-9a-f]{24})', findOne(), getOne())
  router.put('/:id([0-9a-f]{24})', findOne(), putOne())
  router.delete('/:id([0-9a-f]{24})', findOne(), deleteOne())
  router.get('/count', count())

  return function (req, res, next) {
    if (req.locals.table === null) {
      return next()
    } else {
      return router(req, res, next)
    }
  }
}

function getAll() {
  return function (req, res, next) {
    res.send(req.locals.resources)
  }
}

function postOne() {
  return function (req, res, next) {
    co(function *() {
      const result = yield req.db.collection(req.locals.table.key).insertOne(req.body)
      const location = req.baseUrl + '/' + result.insertedId

      return res.status(201).set('Location', location).end()
    })
      .catch(next)
  }
}

function getOne() {
  return function (req, res, next) {
    res.send(req.locals.resource)
  }
}

function putOne() {
  return function (req, res, next) {
    co(function *() {
      const collection = req.db.collection(req.locals.table.key)
      yield collection.updateOne({ _id: req.locals.resource._id }, { $set: req.body })

      return res.status(204).end()
    })
      .catch(next)
  }
}

function deleteOne() {
  return function (req, res, next) {
    co(function *() {
      const collection = req.db.collection(req.locals.table.key)
      yield collection.remove({ _id: req.locals.resource._id })

      res.status(204).end()
    })
      .catch(next)
  }
}

function count() {
  return function (req, res, next) {
    co(function *() {
      const query = typeof req.query.query === 'string' ? JSON.parse(req.query.query) : {}
      const collection = req.db.collection(req.locals.table.key)
      const result = yield collection.count(query)

      return res.send({ result })
    })
      .catch(next)
  }
}

function findOne() {
  return function (req, res, next) {
    co(function *() {
      const id = req.params.id
      const collection = req.db.collection(req.locals.table.key)
      const resource = yield collection.findOne({ _id: new ObjectId(id) })

      if (resource === null) {
        const err = new Error('not found')
        err.status = 404
        return next(err)
      } else {
        req.locals.resource = res.locals.resource = resource
        return next()
      }
    })
      .catch(next)
  }
}

function findAll() {
  return function (req, res, next) {
    co(function *() {
      const query = typeof req.query.query === 'string' ? JSON.parse(req.query.query) : {}
      const sort = typeof req.query.sort === 'string' ? JSON.parse(req.query.sort) : null
      const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : null
      const skip = typeof req.query.skip === 'string' ? parseInt(req.query.skip, 10) : null

      const collection = req.db.collection(req.locals.table.key)
      const cursor = collection.find(query)

      if (sort !== null) {
        cursor.sort(sort)
      }

      if (limit !== null) {
        cursor.limit(limit)
      }

      if (skip !== null) {
        cursor.skip(skip)
      }

      const resources = yield cursor.toArray()

      req.locals.resources = res.locals.resources = resources

      return next()
    })
      .catch(next)
  }
}
