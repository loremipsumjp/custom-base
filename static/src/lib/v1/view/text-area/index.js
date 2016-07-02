import _ from 'lodash'

export class TextAreaView {
  constructor() {}

  initialize({ path }) {
    this.path = path

    return Promise.resolve(this)
  }

  render(options) {
    const html = (_.get(options, this.path) || '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n/g, '<br>')

    return Promise.resolve(html)
  }
}
