import co from 'co'
import qs from 'qs'
import axios from 'axios'
import Mustache from 'mustache'

const siteConfig = require('../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class AccessKeyGeneratePage {
  initialize({ userId }) {
    return co(function *() {
      this.form = {
        status: '',
        memo: '',
      }

      this.validation = {
        status: null,
      }

      this.userId = userId
      this.resourceId = null
      this.accessKey = null
      this.currentView = 'start'

      return this
    }.bind(this))
  }

  onClick(event) {
    event.preventDefault()

    co(function *() {
      this.validation.status = this.form.status !== ''

      const isValid = Object.keys(this.validation).every(key => this.validation[key] === true)

      if (!isValid) {
        return
      }

      const response = yield axios.post(`${baseUrl}/private/api/v1/access-keys/generate`, {
        userId: this.userId,
        status: this.form.status,
        memo: this.form.memo,
      })

      const location = response.headers['location']
      const regexp = new RegExp('([0-9a-f]{24})$')
      const match = regexp.exec(location)

      this.resourceId = match[1]
      this.accessKey = response.data
      this.currentView = 'finish'
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
