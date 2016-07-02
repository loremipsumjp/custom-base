'use strict';

const co = require('co')
const ObjectId = require('mongodb').ObjectId

class Scaffold {
  constructor ({ collection }) {
    this.collection = collection
  }

  findOne() {
    return (req, res, next) => {
      co(function *() {
        const id = req.params.id
        const collection = req.db.collection(this.collection)
        const resource = yield collection.findOne({ _id: new ObjectId(id) })

        if (resource === null) {
          const err = new Error('not found')
          err.status = 404

          return next(err)
        } else {
          req.locals.resource = res.locals.resource = resource

          return next()
        }
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
