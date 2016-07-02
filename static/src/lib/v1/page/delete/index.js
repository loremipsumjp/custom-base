import co from 'co'
import axios from 'axios'
import template from 'jade!./template.jade'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class DeletePage {
  initialize({ table, name, key }) {
    return co(function *() {
      this.table = (yield axios.get(`${baseUrl}/private/api/v1/tables/find-by-key/${table.key}`)).data
      this.name = name

      const pattern = new RegExp(`^${baseUrl}/private/custom-objects/${this.table.key}/([0-9a-f]{24})/${key}/$`)
      const match = pattern.exec(window.location.pathname)
      const id = match[1]

      this.id = id

      return this
    }.bind(this))
  }

  onClick(event) {
    event.preventDefault()

    co(function *() {
      yield axios.delete(`${baseUrl}/private/api/v1/custom-objects/${this.table.key}/${this.id}`)
      window.location.href = '../../'
    }.bind(this))
      .catch(err => console.error(err.stack || err))
  }

  getVueOptions() {
    return co(function *() {
      return {
        data: () => ({ self: this }),

        methods: {
          onClick: event => this.onClick(event),
        },

        template: yield this.render(),
      }
    }.bind(this))
  }

  render() {
    return Promise.resolve(template({ self: this }))
  }
}
