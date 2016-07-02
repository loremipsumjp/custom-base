'use strict';

const port = parseInt(process.env.PORT || '10020', 10)

const fs = require('fs')
const url = require('url')
const http = require('http')
const path = require('path')
const mkdirp = require('mkdirp')

if (require.main === module) {
  main()
}

function main() {
  const server = http.createServer()

  server.on('error', err => console.error(err.stack))
  server.on('listening', () => console.log(`Listening on ${port}`))
  server.on('request', onRequest)

  server.listen(port)
}

function onRequest(req, res) {
  const method = req.method
  const { pathname } = url.parse(req.url)

  console.log(method, pathname)

  if (method === 'GET' && pathname === '/') {
    onRequestGetRoot(req, res)
  } else if (method === 'GET') {
    onRequestGet(req, res)
  } else if (method === 'PUT') {
    onRequestPut(req, res)
  } else if (method === 'DELETE') {
    onRequestDelete(req, res)
  } else {
    onRequestError(req, res)
  }
}

function onRequestGetRoot(req, res) {
  const payload = 'OK'
  const headers = {
    'Content-Type': 'text/plain',
    'Content-Length': payload.length,
  }

  res.writeHead(200, headers)
  res.write(payload)
  res.end()
}

function onRequestGet(req, res) {
  const { pathname, search } = url.parse(req.url)
  const filename = path.join(__dirname, `./data${pathname}`)
  const basename = path.basename(filename)

  fs.access(filename, err => {
    if (err) {
      const status = 404
      const payload = 'not found'
      const headers = {
        'Content-Type': 'text/plain',
        'Content-Length': payload.length,
      }

      res.writeHead(status, headers)
      res.write(payload)
      
      return res.end()
    }

    const headers = {}
    const stream = fs.createReadStream(filename)

    if (search === '?dl=1') {
      headers['Content-Disposition'] = `attachment; filename="${basename}"`
    }

    res.writeHead(200, headers)
    stream.pipe(res)
  })
}

function onRequestPut(req, res) {
  const { pathname } = url.parse(req.url)
  const filename = path.join(__dirname, `./data${pathname}`)
  const dirname = path.dirname(filename)

  mkdirp(dirname, (err) => {
    if (err) {
      const status = 500
      const payload = err.message
      const headers = {
        'Content-Type': 'text/plain',
        'Content-Length': payload.length,
      }

      res.writeHead(status, headers)
      res.write(payload)

      return res.end()
    }

    const stream = fs.createWriteStream(filename)

    req.pipe(stream)
    req.on('end', () => {
      res.writeHead(204)
      res.end()
    })
  })
}

function onRequestDelete(req, res) {
  const { pathname } = url.parse(req.url)
  const filename = path.join(__dirname, `./data${pathname}`)

  fs.unlink(filename, (err) => {
    if (err) {
      const status = 500
      const payload = err.message
      const headers = {
        'Content-Type': 'text/plain',
        'Content-Length': payload.length,
      }

      res.writeHead(status, headers)
      res.write(payload)

      return res.end()
    }

    res.writeHead(204)
    res.end()
  })
}

function onRequestError(req, res) {
  const status = 405
  const payload = 'method not allowed'
  const headers = {
    'Content-Type': 'text/plain',
    'Content-Length': payload.length,
  }

  res.writeHead(status, headers)
  res.write(payload)

  return res.end()
}
