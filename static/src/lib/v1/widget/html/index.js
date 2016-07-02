import _ from 'lodash'
import co from 'co'

export class HTMLWidget {
  initialize({ html }) {
    return co(function *() {
      this.html = html

      return this
    }.bind(this))
  }

  render() {
    return Promise.resolve({ html: this.html })
  }

  ready() {}
}
