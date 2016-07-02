'use strict';

const env = process.env.NODE_ENV || 'development'

const express = require('express')
const siteConfig = require('../config/site')[env]

module.exports = {
  private: {
    api: privateApi,
  },
}

function privateApi() {
  const router = express.Router({ strict: true })

  router.get('/get-upload-url', privateApiGetUploadUrl())

  return router
}

function privateApiGetUploadUrl() {
  return function (req, res, next) {
    const filename = req.query.filename

    const date = new Date().toISOString()
    const dateonly = date.slice(0, 10).replace(/-/g, '')
    const timeonly = date.slice(11, date.indexOf('Z')).replace(/:/g, '')

    const baseUrl = siteConfig.baseUrl
    const profileKey = req.locals.profile.key
    const userId = req.locals.user._id
    const datetime = `${dateonly}T${timeonly}Z`
    const url = `${baseUrl}/private/storage/${profileKey}/${userId}/${datetime}/${filename}`

    res.send({ url })
  }
}
