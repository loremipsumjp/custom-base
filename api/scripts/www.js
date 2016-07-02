'use strict';

const port = parseInt(process.env.PORT || '2000', 10)

const http = require('http')
const co = require('co')
const factory = require('..')

if (require.main === module) {
  main()
}

function main() {
  co(function *() {
    const app = yield factory()
    const server = http.createServer()

    server.on('request', app)
    server.on('error', onError())
    server.on('listening', onListening())

    server.listen(port)
  })
    .catch(err => {
      console.error(err.stack)
    })
}

function onError() {
  return function (err) {
    console.error(err.stack)
  }
}

function onListening() {
  return function () {
    console.log('Listening on ' + port)
  }
}
