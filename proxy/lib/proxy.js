const os = require('os')
const http = require('http')
const owns = {}.hasOwnProperty

module.exports = factory

function factory(options) {
  return function (req, res, next) {
    const protocol = options.protocol
    const hostname = options.hostname
    const port = options.port
    const method = req.method
    const path = req.url
    const headers = req.headers

    let buffer = null

    if (req._body) {
      buffer = new Buffer(JSON.stringify(req.body))
      headers['content-length'] = buffer.length.toString()
    }

    const myReq = http.request({ protocol, hostname, port, method, path, headers })

    myReq.on('error', next)
    myReq.on('response', myRes => {
      res.writeHead(myRes.statusCode, myRes.headers)
      myRes.pipe(res)
    })

    if (req._body) {
      myReq.end(buffer)
    } else if (!req.readable) {
      myReq.end()
    } else {
      req.pipe(myReq)
    }
  }
}
