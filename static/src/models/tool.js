export class ToolModel {
  initialize(resource) {
    this.form = {
      index: '' + (resource.index || ''),
      name: resource.name || '',
      key: resource.key || '',
      className: resource.className || '',
      classData: typeof resource.classData === 'object' ? JSON.stringify(resource.classData, null, 2) : resource.classData || '',
      memo: resource.memo || '',
    }

    this.validation = {
      index: null,
      name: null,
      key: null,
      className: null,
      classData: null,
    }


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
      index: parseInt(this.form.index, 10),
      name: this.form.name,
      key: this.form.key,
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
