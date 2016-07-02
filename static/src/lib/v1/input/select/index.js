import co from 'co'
import axios from 'axios'
import Mustache from 'mustache'
import template from 'jade!./template.jade'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class SelectInput {
  async initialize({ key, path, options, url, value, text }) {
    this.key = key
    this.path = path

    this.form = {
      value: '',
    }

    if (Array.isArray(options)) {
      this.options = options.map(option => {
        return typeof option === 'object' ? option : {
          value: option,
          text: option,
        }
      })
    } else if (typeof url === 'object') {
      const response = await axios.get(url.pathname, { params: url.query })
      this.options = response.data.map(resource => ({
        value: Mustache.render(value.template, resource),
        text: Mustache.render(text.template, resource),
      }))
    } else {
      throw new Error('invalid argument')
    }

    return this
  }

  async get() {
    return this.form.value
  }

  async set(value) {
    return this.form.value = value
  }

  async render() {
    return template({ self: this })
  }

  async ready() {}
}
