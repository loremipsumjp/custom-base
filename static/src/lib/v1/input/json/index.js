import template from 'jade!./template.jade'

export class JSONInput {
  async initialize({ key, path, defaultValue }) {
    this.key = key
    this.path = path

    this.form = {
      value: defaultValue || '',
    }

    return this
  }

  async get() {
    return JSON.parse(this.form.value)
  }

  async set(value) {
    return this.form.value = JSON.stringify(value, null, 2)
  }

  async render() {
    return template({ self: this })
  }

  async ready() {}
}
