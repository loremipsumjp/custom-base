'use strict';

const co = require('co')
const ObjectId = require('mongodb').ObjectId

class Scaffold {
  constructor ({ collection }) {
    this.collection = collection
  }

  count() {
    return (req, res, next) => {
      co(function *() {
        const query = typeof req.query.query === 'string' ? JSON.parse(req.query.query) : {}
        const result = yield req.db.collection(this.collection).count(query)

        res.send({ result })
      }.bind(this))
        .catch(next)
    }
  }

  findAll() {
    return (req, res, next) => {
      co(function *() {
        const query = typeof req.query.query === 'string' ? JSON.parse(req.query.query) : {}
        const projection = typeof req.query.projection === 'string' ? JSON.parse(req.query.projection) : {}
        const sort = typeof req.query.sort === 'string' ? JSON.parse(req.query.sort) : null
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : null
        const skip = typeof req.query.skip === 'string' ? parseInt(req.query.skip, 10) : null
        const cursor = req.db.collection(this.collection).find(query)

        if (sort !== null) {
          cursor.sort(sort)
        }

        if (limit !== null) {
          cursor.limit(limit)
        }

        if (skip !== null) {
          cursor.skip(skip)
        }

        req.locals.resources = res.locals.resources = yield cursor.toArray()

        return next()
      }.bind(this))
        .catch(next)
    }
  }

  getAll() {
    return (req, res, next) => {
      res.send(req.locals.resources)
    }
  }

  postOne() {
    return (req, res, next) => {
      co(function *() {
        const result = yield req.db.collection(this.collection).insertOne(req.body)
        const location = `${req.baseUrl}/${result.insertedId}`

        res.status(201).set('Location', location).end()
      }.bind(this))
        .catch(next)
    }
  }

  findOne() {
    return this.findOneById()
  }

  findOneById() {
    return (req, res, next) => {
      co(function *() {
        const id = req.params.id
        const resource = yield req.db.collection(this.collection).findOne({ _id: new ObjectId(id) })

        if (resource === null) {
          const err = new Error('not found')
          err.status = 404
          return next(err)
        }

        req.locals.resource = res.locals.resource = resource

        return next()
      }.bind(this))
        .catch(next)
    }
  }

  findOneByKey() {
    return (req, res, next) => {
      co(function *() {
        const key = req.params.key
        const resource = yield req.db.collection(this.collection).findOne({ key })

        if (resource === null) {
          const err = new Error('not found')
          err.status = 404
          return next(err)
        }

        req.locals.resource = res.locals.resource = resource
        return next()
      }.bind(this))
        .catch(next)
    }
  }

  getOne() {
    return (req, res, next) => {
      res.send(req.locals.resource)
    }
  }

  putOne() {
    return (req, res, next) => {
      co(function *() {
        if (typeof req.body._id !== 'undefined') {
          delete req.body._id
        }

        yield req.db.collection(this.collection).updateOne({ _id: req.locals.resource._id }, { $set: req.body })
        return res.status(204).end()
      }.bind(this))
        .catch(next)
    }
  }

  deleteOne() {
    return (req, res, next) => {
      co(function *() {
        yield req.db.collection(this.collection).remove({ _id: req.locals.resource._id })
        return res.status(204).end()
      }.bind(this))
        .catch(next)
    }
  }
}

function factory(options) {
  return new Scaffold(options)
}

module.exports = factory
module.exports.Scaffold = Scaffold
