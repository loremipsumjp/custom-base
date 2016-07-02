import co from 'co'
import axios from 'axios'
import template from 'jade!./template.jade'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class FileInput {
  async initialize({ key, path }) {
    this.key = key
    this.path = path

    this.value = null

    this.form = {
      change: true,
    }

    this.elements = {
      input: null,
    }

    return this
  }

  async set(value) {
    this.value = value
    this.form.change = !value
  }

  async prepare() {
    if (this.form.change === false) {
      return
    } else if (this.elements.input.files.length === 0) {
      return this.value = null
    } else {
      const file = this.elements.input.files[0]
      const filename = file.name
      const response = await axios.get(`${baseUrl}/private/api/v1/storage/get-upload-url?filename=${filename}`)
      const url = response.data.url
      
      await axios.put(url, file)

      return this.value = url
    }
  }

  async get() {
    return this.value
  }

  async render() {
    return template({ self: this })
  }

  async ready() {
    this.elements.input = document.getElementById(this.key)
  }
}
