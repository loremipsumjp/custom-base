import co from 'co'
import axios from 'axios'

const siteConfig = require('../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class FileModel {
  initialize(resource) {
    this.form = {
      index: '' + (resource.index || ''),
      name: resource.name || '',
      key: resource.key || '',
      path: resource.path || '',
      file: {
        change: true,
        input: null,
      },
      memo: resource.memo || '',
    }

    this.validation = {
      index: null,
      name: null,
      key: null,
      pathNotEmpty: null,
      pathNotExists: null,
      file: null,
    }

    this.method = null

    return Promise.resolve(this)
  }

  validate() {
    return co(function *() {
      this.validation.index = /^[0-9]+$/.test(this.form.index)
      this.validation.name = this.form.name !== ''
      this.validation.key = /^[a-z][a-z0-9\-]*$/.test(this.form.key)
      this.validation.pathNotEmpty = this.method === 'PUT' || this.form.path !== ''
      this.validation.pathNotExists = this.method === 'PUT' || !this.validation.pathNotEmpty || (yield axios.get(`${baseUrl}/private/api/v1/files`, {
        params: {
          query: {
            path: this.form.path,
          },
          limit: 1,
        },
      })).data.length === 0
      this.validation.file = this.form.file.change === false || this.form.file.input.files.length !== 0

      return Object.keys(this.validation).every(key => this.validation[key] === true)
    }.bind(this))
  }

  convert() {
    return co(function *() {
      if (this.form.file.change === true) {
        yield axios.put(this.form.path, this.form.file.input.files[0])
      }

      return {
        index: parseInt(this.form.index, 10),
        name: this.form.name,
        key: this.form.key,
        path: this.form.path,
        memo: this.form.memo,
      }
    }.bind(this))
  }
}

function isJSON(str) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}
