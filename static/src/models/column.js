export class ColumnModel {
  initialize(resource) {
    this.form = {
      index: resource.index || '',
      name: resource.name || '',
      key: resource.key || '',
      type: resource.type || '',
      memo: resource.memo || '',
    }

    this.validation = {
      index: null,
      name: null,
      key: null,
      type: null,
    }

    this.tableId = null

    return Promise.resolve(this)
  }

  validate() {
    this.validation.index = /^[0-9]+$/.test(this.form.index)
    this.validation.name = this.form.name !== ''
    this.validation.key = /^[a-z][a-z0-9\-]*$/.test(this.form.key)
    this.validation.type = this.form.type !== ''

    return Promise.resolve(Object.keys(this.validation).every(key => this.validation[key] === true))
  }

  convert() {
    var body = {
      tableId: this.tableId,
      index: this.form.index,
      name: this.form.name,
      key: this.form.key,
      type: this.form.type,
      memo: this.form.memo,
    }

    return Promise.resolve(body)
  }
}
