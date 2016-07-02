'use strict'

module.exports = factory

function factory() {
  return function (req, res, next) {
    const authorization = req.headers['authorization']
    const buffer = new Buffer(authorization.split(' ')[1], 'base64')
    const userId = buffer.toString().split(':')[0]

    req.locals.user = { _id: userId }

    return next()
  }
}
