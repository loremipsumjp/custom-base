export class AccessKeyModel {
  initialize(resource) {
    this.form = {
      status: resource.status || '',
      memo: resource.memo || '',
    }

    this.validation = {
      status: null,
    }

    return Promise.resolve(this)
  }

  validate() {
    this.validation.status = this.form.status !== ''

    return Promise.resolve(Object.keys(this.validation).every(key => this.validation[key] === true))
  }

  convert() {
    var body = {
      status: this.form.status,
      memo: this.form.memo,
    }

    return Promise.resolve(body)
  }
}
