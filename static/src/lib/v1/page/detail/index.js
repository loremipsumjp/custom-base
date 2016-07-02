import _ from 'lodash'
import co from 'co'
import axios from 'axios'
import template from 'jade!./template.jade'
import { fetchOne, fetchAll } from '../../util/fetch'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class DetailPage {
  initialize({ table, name, include, panels, lists }) {
    return co(function *() {
      this.table = (yield axios.get(`${baseUrl}/private/api/v1/tables/find-by-key/${table.key}`)).data
      this.name = name
      this.include = include
      this.panels = yield panels.map(panel => new Panel().initialize(panel))
      this.lists = yield lists.map(list => new List().initialize(list))

      this.table.formats = (yield axios.get(`${baseUrl}/private/api/v1/formats`, {
        params: {
          query: { tableId: this.table._id },
          sort: { index: 1 },
        },
      })).data

      const pattern = new RegExp(`^${baseUrl}/private/custom-objects/${this.table.key}/([0-9a-f]{24})/$`)
      const match = pattern.exec(window.location.pathname)
      const id = match[1]

      this.resource = yield fetchOne(`${baseUrl}/private/api/v1/custom-objects/${this.table.key}/${id}`, { include: this.include })

      for (const list of this.lists) {
        yield list.fetch(id)
      }

      return this
    }.bind(this))
  }

  getVueOptions() {
    return co(function *() {
      return {
        data: () => ({ self: this }),

        template: yield this.render(),
      }
    }.bind(this))
  }

  render() {
    return co(function *() {
      return template({
        self: this,
        panels: yield this.panels.map(panel => panel.render({ resource: this.resource })),
        lists: yield this.lists.map(list => list.render()),
      })
    }.bind(this))
  }
}

class Panel {
  constructor() {}

  initialize({ name, rows }) {
    return co(function *() {
      this.name = name
      this.rows = yield rows.map(row => new Row().initialize(row))

      return this
    }.bind(this))
  }

  render(options) {
    return co(function *() {
      return {
        name: this.name,
        rows: yield this.rows.map(row => row.render(options))
      }
    }.bind(this))
  }
}

class Row {
  constructor() {}

  initialize({ name, view }) {
    return co(function *() {
      this.name = name

      const ViewClass = _.get(window, view.className)

      this.view = yield new ViewClass().initialize(view.classData)

      return this
    }.bind(this))
  }

  render(options) {
    return co(function *() {
      return {
        name: this.name,
        html: yield this.view.render(options)
      }
    }.bind(this))
  }
}

class List {
  initialize({ name, table, url, include, columns }) {
    return co(function *() {
      this.name = name
      this.table = (yield axios.get(`${baseUrl}/private/api/v1/tables/find-by-key/${table.key}`)).data
      this.table.formats = (yield axios.get(`${baseUrl}/private/api/v1/formats`, {
        params: {
          query: { tableId: this.table._id },
          sort: { index: 1 },
        },
      })).data
      this.url = url
      this.include = include
      this.columns = yield columns.map(column => new Column().initialize(column))
      return this
    }.bind(this))
  }

  fetch(id) {
    return co(function *() {
      this.url.query.query[this.url.column.key] = id
      this.resources = yield fetchAll(this.url, { include: this.include })
    }.bind(this))
  }

  render() {
    return co(function *() { 
      return {
        name: this.name,
        table: this.table,
        column: this.url.column,
        headers: this.columns.map(column => column.name),
        rows: yield this.resources.map(resource => this.renderRow({ resource })),
      }
    }.bind(this))
  }

  renderRow({ resource }) {
    return co(function *() {
      return {
        resource,
        columns: yield this.columns.map(column => column.render({ resource })),
      }
    }.bind(this))
  }
}

class Column {
  initialize({ name, view }) {
    return co(function *() {
      this.name = name

      const ViewClass = _.get(window, view.className)
      
      this.view = yield new ViewClass().initialize(view.classData)

      return this
    }.bind(this))
  }

  render(options) {
    return co(function *() {
      return { html: yield this.view.render(options) }
    }.bind(this))
  }
}
