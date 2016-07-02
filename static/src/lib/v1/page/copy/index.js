import co from 'co'
import qs from 'qs'
import axios from 'axios'
import template from 'jade!./template.jade'
import { FormPage, Panel } from '../form'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class CopyPage extends FormPage {
  initialize({ table, name, key, superPage, panels }) {
    return co(function *() {
      this.table = (yield axios.get(`${baseUrl}/private/api/v1/tables/find-by-key/${table.key}`)).data
      this.name = name

      if (typeof superPage !== 'undefined') {
        this.superPage = yield this.fetchSuperPage(superPage)
        panels = this.superPage.classData.panels
      }

      this.panels = yield panels.map(panel => new Panel().initialize(panel))
      this.form = {}
      this.validation = {}

      const pattern = new RegExp(`^${baseUrl}/private/custom-objects/${this.table.key}/([0-9a-f]{24})/${key}/$`)
      const match = pattern.exec(window.location.pathname)
      const id = match[1]

      this.id = id

      const response = yield axios.get(`${baseUrl}/private/api/v1/custom-objects/${this.table.key}/${id}`)
      const resource = response.data

      for (const panel of this.panels) {
        for (const row of panel.rows) {
          yield row.input.set(resource[row.key])

          this.form[row.key] = row.input.form
          this.validation[row.key] = {
            isValid: null,
            message: null,
          }
        }
      }

      const query = qs.parse(window.location.search.slice(1))

      for (const panel of this.panels) {
        for (const row of panel.rows) {
          if (typeof query[row.key] !== 'undefined') {
            yield row.input.set(query[row.key])
          }
        }
      }

      return this
    }.bind(this))
  }

  render() {
    return co(function *() {
      return template({
        self: this,
        panels: yield this.panels.map(panel => panel.render())
      })
    }.bind(this))
  }

  onClick(event) {
    event.preventDefault()

    co(function *() {
      const isValid = yield this.validate()

      if (!isValid) {
        return
      }

      const data = {}

      for (const panel of this.panels) {
        for (const row of panel.rows) {
          if (typeof row.input.prepare === 'function') {
            yield row.input.prepare()
          }

          data[row.key] = yield row.input.get()
        }
      }

      const response = yield axios.post(`${baseUrl}/private/api/v1/custom-objects/${this.table.key}`, data)
      const location = response.headers['location']
      const pattern = new RegExp(`${baseUrl}/private/api/v1/custom-objects/${this.table.key}/([0-9a-f]{24})`)
      const match = pattern.exec(location)
      const id = match[1]

      return window.location.href = `../../${id}/`
    }.bind(this))
      .catch(err => console.error(err.stack || err) )
  }
}
