import template from 'jade!./template.jade'

export class PasswordInput {
  async initialize({ key, path }) {
    this.key = key
    this.path = path

    this.value = null

    this.form = {
      change: true,
      value: '',
    }

    return this
  }

  async get() {
    return (this.form.change === true) ? this.form.value : undefined
  }

  async set(value) {
    this.value = value
    this.form.change = !value
  }

  async render() {
    return template({ self: this })
  }

  async ready() {}
}
