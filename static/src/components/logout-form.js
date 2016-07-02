import co from 'co'
import qs from 'qs'
import axios from 'axios'

export class LogoutForm {
  constructor() {
  }

  onClick(event) {
    co(function *() {
      event.preventDefault()

      const response = yield axios.put('/private/api/v1/auth/logout')

      if (200 <= response.status && response.status < 300) {
        window.location.href = '../../../public/auth/login/?status=logout'
      }
    }.bind(this))
      .catch(err => {
        console.error(err.stack || err)
      })
  }

  getVueOptions({ template }) {
    return {
      data: () => {
        return { self: this }
      },

      methods: {
        onClick: event => {
          this.onClick(event)
        }
      },

      template: template,
    }
  }
}
