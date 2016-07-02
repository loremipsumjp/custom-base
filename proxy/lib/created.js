'use strict'

module.exports = factory

function factory() {
  return function (req, res, next) {
    if (req.method === 'POST') {
      const now = new Date().toISOString()

      req.body.createdAt = now
      req.body.createdBy = req.locals.user._id
      req.body.updatedAt = now
      req.body.updatedBy = req.locals.user._id
    }

    return next()
  }
}
