import template from 'jade!./template.jade'

export class TextAreaInput {
  async initialize({ key, path }) {
    this.key = key
    this.path = path

    this.form = {
      value: '',
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
