import _ from 'lodash'
import co from 'co'
import qs from 'qs'
import axios from 'axios'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class FormPage {
  initialize({ table, page}) {
    throw new Error('not implemented')
  }

  render() {
    throw new Error('not implemented')
  }

  onClick(event) {
    throw new Error('not implemented')
  }

  getVueOptions() {
    return co(function *() {
      return {
        data: () => ({ self: this }),

        methods: {
          onClick: event => this.onClick(event),
        },

        ready: () => this.ready(),

        template: yield this.render(),
      }
    }.bind(this))
  }

  fetchSuperPage(superPage) {
    return co(function *() {
      const params = {
        query: {
          tableId: this.table._id,
          key: superPage.key,
        },
        limit: 1,
      }

      const response = yield axios.get(`${baseUrl}/private/api/v1/pages`, { params })

      return response.data[0]
    }.bind(this))
  }

  ready() {
    for (const panel of this.panels) {
      for (const row of panel.rows) {
        row.input.ready()
      }
    }
  }

  validate() {
    return co(function *() {
      for (const panel of this.panels) {
        for (const row of panel.rows) {
          yield this.validateRow(row)
        }
      }

      return Object.keys(this.validation).every(key => this.validation[key].isValid)
    }.bind(this))
  }

  validateRow(row) {
    return co(function *() {
      for (const rule of row.validation.rules) {
        const isValid = yield rule.validator.validate(this.form[row.key])

        if (!isValid) {
          return this.validation[row.key] = {
            isValid: false,
            message: rule.message,
          }
        }
      }

      return this.validation[row.key] = {
        isValid: true,
        message: null,
      }
    }.bind(this))
  }
}

export class Panel {
  initialize({ name, rows }) {
    return co(function *() {
      this.name = name
      this.rows = yield rows.map(row => new Row().initialize(row))

      return this
    }.bind(this))
  }

  render() {
    return co(function *() {
      return {
        name: this.name,
        rows: yield this.rows.map(row => row.render()),
      }
    }.bind(this))
  }
}

class Row {
  initialize({ name, key, input, validation }) {
    return co(function *() {
      this.name = name
      this.key = key

      const InputClass = _.get(window, input.className)

      input.classData.name = input.classData.name || name
      input.classData.key = input.classData.key || key
      input.classData.path = input.classData.path || `self.form.${key}`

      this.input = yield new InputClass().initialize(input.classData)

      this.validation = yield new Validation().initialize(validation)

      return this
    }.bind(this))
  }

  render() {
    return co(function *() {
      return {
        name: this.name,
        key: this.key,
        input: { html: yield this.input.render() },
      }
    }.bind(this))
  }
}

class Validation {
  initialize({ rules }) {
    return co(function *() {
      this.rules = yield rules.map(rule => new Rule().initialize(rule))

      return this
    }.bind(this))
  }
}

class Rule {
  initialize({ message, validator }) {
    return co(function *() {
      this.message = message

      const ValidatorClass = _.get(window, validator.className)

      this.validator = yield new ValidatorClass().initialize(validator.classData)

      return this
    }.bind(this))
  }
}
