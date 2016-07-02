import template from 'jade!./template.jade'

export class DateTimeInput {
  async initialize({ key, path }) {
    this.key = key
    this.path = path

    this.form = {
      value: '',
    }

    return this
  }

  async get() {
    return new Date(this.form.value).toISOString()
  }

  async set(value) {
    if (!value) {
      this.form.value = ''
    }

    const date = new Date(value)
    const yyyy = '' + date.getFullYear()
    const mm = ('0' + (date.getMonth() + 1)).slice(-2)
    const dd = ('0' + date.getDate()).slice(-2)
    const hh = ('0' + date.getHours()).slice(-2)
    const ii = ('0' + date.getMinutes()).slice(-2)

    return this.form.value = `${yyyy}-${mm}-${dd} ${hh}:${ii}`
  }

  async render() {
    return template({ self: this })
  }

  async ready() {}
}
