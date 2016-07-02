'use strict'

module.exports = factory

function factory() {
  return function (req, res, next) {
    if (req.method === 'PUT') {
      const now = new Date().toISOString()

      req.body.updatedAt = now
      req.body.updatedBy = req.locals.user._id
    }

    return next()
  }
}
