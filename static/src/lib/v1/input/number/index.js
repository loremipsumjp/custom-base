import template from 'jade!./template.jade'

export class NumberInput {
  async initialize({ key, path }) {
    this.key = key
    this.path = path

    this.form = {
      value: '',
    }

    return this
  }

  async get() {
    return parseInt(this.form.value, 10)
  }

  async set(value) {
    return this.form.value = '' + value
  }

  async render() {
    return template({ self: this })
  }

  async ready() {}
}
