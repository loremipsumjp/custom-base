import _ from 'lodash'

export class JSONView {
  async initialize({ path }) {
    this.path = path

    return this
  }

  async render(options) {
    const value = _.get(options, this.path)

    if (!value) {
      return '-'
    }

    const html = JSON.stringify(value, null, 2)
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n/g, '<br>')
      .replace(/ /g, '&nbsp;')

    return html
  }
}
