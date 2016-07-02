import co from 'co'
import { fetchAll } from '../../util/fetch'

export class ListWidget {
  initialize({ url, include, template }) {
    return co(function *() {
      this.resources = yield fetchAll(url, { include })
      this.template = template

      return this
    }.bind(this))
  }

  render() {
    return co(function *() {
      return { html: ejs.render(this.template, { resources: this.resources }) }
    }.bind(this))
  }

  ready() {}
}
