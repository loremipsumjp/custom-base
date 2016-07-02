export class FormatModel {
  initialize(resource) {
    this.form = {
      index: '' + (resource.index || ''),
      name: resource.name || '',
      key: resource.key || '',
      template: resource.template || '',
      style: resource.style || '',
      className: resource.className || '',
      classData: typeof resource.classData === 'object' ? JSON.stringify(resource.classData, null, 2) : resource.classData || '',
      memo: resource.memo || '',
    }

    console.log(resource)

    this.validation = {
      index: null,
      name: null,
      key: null,
      className: null,
      classData: null,
    }

    this.tableId = null

    return Promise.resolve(this)
  }

  validate() {
    this.validation.index = /^[0-9]+$/.test(this.form.index)
    this.validation.name = this.form.name !== ''
    this.validation.key = /^[a-z][a-z0-9\-]*$/.test(this.form.key)
    this.validation.className = this.form.className !== ''
    this.validation.classData = isJSON(this.form.classData)

    return Promise.resolve(Object.keys(this.validation).every(key => this.validation[key] === true))
  }

  convert() {
    var body = {
      tableId: this.tableId,
      index: parseInt(this.form.index, 10),
      name: this.form.name,
      key: this.form.key,
      template: this.form.template,
      style: this.form.style,
      className: this.form.className,
      classData: JSON.parse(this.form.classData),
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
