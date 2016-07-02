import co from 'co'
import qs from 'qs'
import axios from 'axios'

export class IndexPage {
  initialize({ url, search, sort }) {
    return co(function *() {
      const query = qs.parse(window.location.search.slice(1))

      this.query = {
        q: query.q || '',
        sort: query.sort || sort.default,
        page: query.page || '1',
      }

      this.form = {
        q: this.query.q,
        sort: this.query.sort
      }

      this.limit = 20
      this.page = parseInt(this.query.page, 10)
      this.skip = this.limit * (this.page - 1)

      const params = {
        query: this.query.q === '' ? {} : {
          $or: search.keyword.targets.map(target => {
            const condition = {}
            condition[target] = { $regex: this.query.q }

            return condition
          }),
        },
        sort: this.query.sort,
        limit: this.limit,
        skip: this.skip,
      }

      this.resources = (yield axios.get(url, { params })).data
      this.count = (yield axios.get(url + '/count', { params })).data.result

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

  getVueOptions({ template }) {
    return {
      data: () => ({ self: this }),

      methods: {
        onClickSearch: event => this.onClickSearch(event),
        onChangeSort: event => this.onChangeSort(event),
        onClickPage: (event, page) => this.onClickPage(event, page),
      },

      template: template,
    }
  }
}
