'use strict';

const env = process.env.NODE_ENV || 'development'

const co = require('co')
const MongoClient = require('mongodb').MongoClient
const mongodbConfig = require('../config/mongodb')[env]

if (require.main === module) {
  main()
}

function main() {
  co(function *() {
    const db = yield MongoClient.connect(mongodbConfig.url)

    const name = process.argv.length === 2 ? 'sales-base' : process.argv[2]
    const fixture = require('../test/fixture/' + name)

    try {
      yield fixture(db)
    } catch (err) {
      console.error(err.stack)
    } finally {
      yield db.close()
    }
  })
    .catch(err => {
      console.error(err.stack)
    })
}
