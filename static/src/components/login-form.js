import co from 'co'
import qs from 'qs'
import axios from 'axios'

export class LoginForm {
  constructor() {
    const querystring = window.location.search.slice(1)
    const query = qs.parse(querystring)

    this.form = {
      username: query.username || '',
      password: query.password || '',
    }

    this.validation = {
      username: null,
      password: null,
    }

    this.status = query.status || null
  }

  onClick(event) {
    co(function *() {
      event.preventDefault()

      this.validation.username = this.form.username !== ''
      this.validation.password = this.form.password !== ''

      const isValid = Object.keys(this.validation).every(key => this.validation[key] === true)

      if (!isValid) {
        return
      }

      try {
        yield axios.put('/public/api/v1/auth/login', {
          username: this.form.username,
          password: this.form.password,
        })

        window.location.href = '../../../private/'
      } catch(response) {
        if (response.data.message === 'invalid credentials') {
          this.status = 'invalid-credentials'
        } else {
          const err = new Error('invalid status')
          err.response = response
          throw err
        }
      }
    }.bind(this))
      .catch(err => {
        console.error(err.stack)
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
