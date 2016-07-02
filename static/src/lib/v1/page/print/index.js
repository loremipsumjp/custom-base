import _ from 'lodash'
import co from 'co'
import axios from 'axios'
import { fetchOne } from '../../util/fetch'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class PrintPage {
  async initialize({ table, name, key, include }) {
    this.table = (await axios.get(`${baseUrl}/private/api/v1/tables/find-by-key/${table.key}`)).data
    this.name = name
    this.include = include

    const pattern = new RegExp(`^${baseUrl}/private/custom-objects/${this.table.key}/([0-9a-f]{24})/${key}/([a-z][0-9a-z\\-]*)/$`)
    const match = pattern.exec(window.location.pathname)
    const id = match[1]
    const formatKey = match[2]

    this.resource = await fetchOne(`${baseUrl}/private/api/v1/custom-objects/${this.table.key}/${id}`, { include: this.include })

    const format = (await axios.get(`${baseUrl}/private/api/v1/formats`, {
      params: {
        query: {
          tableId: this.table._id,
          key: formatKey,
        },
      },
    })).data[0]

    const FormatClass = _.get(window, format.className)

    this.format = await new FormatClass().initialize(format)

    return this
  }

  async getVueOptions() {
    return {
      data: () => ({ self: this }),

      template: await this.render(),

      components: {
        format: await this.format.getVueOptions({ resource: this.resource }),
      },
    }
  }

  async render() {
    return '<component is="format"></component>'
  }
}
