'use strict';

const http = require('http')

if (require.main === module) {
  main()
}

function main() {
  testPut()
    .then(testGet)
    .then(testDelete)
    .catch(err => console.error(err.stack))
}

function testPut() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      method: 'PUT',
      host: '127.0.0.1',
      port: 10020,
      path: '/test/message.txt',
    })

    req.on('response', res => {
      console.log(res.statusCode)

      res.on('data', chunk => console.log(chunk.toString()))
      res.on('end', resolve)
      res.on('error', reject)
    })

    req.write('Hello, world.')
    req.end()
  })
}

function testGet() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      method: 'GET',
      host: '127.0.0.1',
      port: 10020,
      path: '/test/message.txt',
    })

    req.on('response', res => {
      console.log(res.statusCode)

      res.on('data', chunk => console.log(chunk.toString()))
      res.on('end', resolve)
      res.on('error', reject)
    })

    req.end()
  })
}

function testDelete() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      method: 'DELETE',
      host: '127.0.0.1',
      port: 10020,
      path: '/test/message.txt',
    })

    req.on('response', res => {
      console.log(res.statusCode)

      res.on('data', chunk => console.log(chunk.toString()))
      res.on('end', resolve)
      res.on('error', reject)
    })

    req.end()
  })
}
