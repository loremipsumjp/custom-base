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

    headers['authorization'] = 'Basic ' + new Buffer(`${req.locals.user._id}:`).toString('base64')

    const myReq = http.request({ protocol, hostname, port, method, path, headers })

    myReq.on('error', next)
    myReq.on('response', myRes => {
      if (myRes.statusCode === 201) {
        myRes.headers['location'] = req.baseUrl + myRes.headers['location']
      }

      res.writeHead(myRes.statusCode, myRes.headers)
      myRes.pipe(res)
    })

    if (!req.readable) {
      myReq.end()
    } else {
      req.pipe(myReq)
    }
  }
}
