import co from 'co'
import axios from 'axios'

export class FileDeletePage {
  initialize({ method, url, redirect }) {
    return co(function *() {
      this.method = method
      this.url = url
      this.redirect = redirect

      return this
    }.bind(this))
  }

  onClick(event) {
    event.preventDefault()

    co(function *() {
      const resource = (yield axios.get(this.url)).data

      try { yield axios.delete(resource.path) } catch (e) {}

      yield axios({
        method: this.method,
        url: this.url,
      })

      window.location.href = this.redirect
    }.bind(this))
      .catch(err => console.error(err.stack || err))
  }

  getVueOptions({ template }) {
    return {
      data: () => ({ self: this }),

      methods: {
        onClick: event => this.onClick(event),
      },

      template: template,
    }
  }
}
