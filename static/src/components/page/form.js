import co from 'co'
import qs from 'qs'
import axios from 'axios'
import Mustache from 'mustache'

export class FormPage {
  initialize({ ModelClass, resourceUrl, method, url, redirect }) {
    return co(function *() {
      this.method = method
      this.url = url
      this.redirect = redirect

      const query = qs.parse(window.location.search.slice(1))
      const resource = typeof resourceUrl === 'string' ? (yield axios.get(resourceUrl)).data : query
      const model = yield new ModelClass().initialize(resource)

      this.model = model

      return this
    }.bind(this))
  }

  onClick(event) {
    event.preventDefault()

    co(function *() {
      const isValid = yield this.model.validate()

      if (!isValid) {
        return
      }

      const response = yield axios({
        method: this.method,
        url: this.url,
        data: yield this.model.convert(),
      })

      let context = {}

      if (this.method === 'POST') {
        const location = response.headers['location']
        const resource = (yield axios.get(location)).data

        context = resource
      }

      window.location.href = Mustache.render(this.redirect, context)
    }.bind(this))
      .catch(err => console.error(err.stack || err))
  }

  getVueOptions({ template, ready }) {
    return {
      data: () => ({ self: this }),

      methods: {
        onClick: event => this.onClick(event),
      },

      template: template,

      ready: ready || (() => {}),
    }
  }
}
