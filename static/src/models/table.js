export class TableModel {
  initialize(resource) {
    this.form = {
      index: '' + (resource.index || ''),
      name: resource.name || '',
      key: resource.key || '',
      association: typeof resource.association === 'object' ? JSON.stringify(resource.association, null, 2) : resource.association || '',
      memo: resource.memo || '',
    }

    this.validation = {
      index: null,
      name: null,
      key: null,
      association: null,
    }

    return Promise.resolve(this)
  }

  validate() {
    this.validation.index = /^[0-9]+$/.test(this.form.index)
    this.validation.name = this.form.name !== ''
    this.validation.key = /^[a-z][a-z0-9\-]*$/.test(this.form.key)
    this.validation.association = isJSON(this.form.association)

    return Promise.resolve(Object.keys(this.validation).every(key => this.validation[key] === true))
  }

  convert() {
    var body = {
      index: parseInt(this.form.index, 10),
      name: this.form.name,
      key: this.form.key,
      association: JSON.parse(this.form.association),
      memo: this.form.memo,
    }

    return Promise.resolve(body)
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
