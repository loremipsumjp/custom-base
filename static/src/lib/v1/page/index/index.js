import co from 'co'
import qs from 'qs'
import axios from 'axios'
import template from 'jade!./template.jade'
import { fetchAll } from '../../util/fetch'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class IndexPage {
  initialize({ table, name, search, sort, list }) {
    return co(function *() {
      this.table = (yield axios.get(`${baseUrl}/private/api/v1/tables/find-by-key/${table.key}`)).data
      this.name = name
      this.search = search
      this.sort = sort
      this.list = list

      this.table.formats = (yield axios.get(`${baseUrl}/private/api/v1/formats`, {
        params: {
          query: { tableId: this.table._id },
          sort: { index: 1 },
        },
      })).data

      this.sort.order.options = this.sort.order.options.map(option => ({
        value: typeof option.value === 'string' ? option.value : JSON.stringify(option.value),
        text: option.text,
      }))

      const query = qs.parse(window.location.search.slice(1))

      this.query = {
        q: query.q || '',
        sort: query.sort || this.sort.order.default || this.sort.order.options[0].value,
        page: query.page || '1',
      }

      this.form = {
        q: this.query.q,
        sort: this.query.sort,
      }

      this.limit = 20
      this.page = parseInt(this.query.page, 10)
      this.skip = (this.page - 1) * this.limit

      const params = {
        query: this.query.q === '' ? {} : {
          $or: this.search.keyword.targets.map(target => {
            const condition = {}
            condition[target.key] = { $regex: this.query.q }
            return condition
          }, []),
        },
        sort: this.query.sort,
        limit: this.limit,
        skip: this.skip,
      }

      const url = {
        pathname: `${baseUrl}/private/api/v1/custom-objects/${this.table.key}`,
        query: params,
      }

      this.resources = yield fetchAll(url, { include: this.list.include })

      delete params.sort
      delete params.limit
      delete params.skip

      this.count = (yield axios.get(`${baseUrl}/private/api/v1/custom-objects/${this.table.key}/count`, { params })).data.result

      this.columns = yield this.list.columns.map(column => new Column().initialize(column))

      return this
    }.bind(this))
  }

  onClickSearch(event) {
    event.preventDefault()

    window.location.href = './?' + qs.stringify({
      q: this.form.q,
      sort: this.query.sort,
      page: 1,
    })
  }

  onChangeSort(event) {
    event.preventDefault()

    window.location.href = './?' + qs.stringify({
      q: this.query.q,
      sort: this.form.sort,
      page: this.query.page,
    })
  }

  onClickPage(event, page) {
    event.preventDefault()

    window.location.href = './?' + qs.stringify({
      q: this.query.q,
      sort: this.query.sort,
      page: page,
    })
  }

  onClickPageNext(event) {
    this.onClickPage(event, this.page + 1)
  }

  onClickPagePrevious(event) {
    this.onClickPage(event, this.page - 1)
  }

  getVueOptions() {
    return co(function *() {
      return {
        data: () => { 
          return { self: this }
        },

        methods: {
          onClickSearch: event => {
            this.onClickSearch(event)
          },

          onChangeSort: event => {
            this.onChangeSort(event)
          },

          onClickPage: (event, page) => {
            this.onClickPage(event, page)
          },

          onClickPageNext: event => {
            this.onClickPageNext(event)
          },

          onClickPagePrevious: event => {
            this.onClickPagePrevious(event)
          },
        },

        template: yield this.render(),
      }
    }.bind(this))
  }

  render() {
    return co(function *() {
      return template({
        self: this,
        rows: yield this.resources.map(resource => this.renderRow({ resource })),
      })
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
      return { html: yield this.view.render(options) }
    }.bind(this))
  }
}
