import _ from 'lodash'

export class ImageView {
  async initialize({ path }) {
    this.path = path

    return this
  }

  async render(options) {
    const url = _.get(options, this.path)

    if (url) {
      return `<img class="img" src="${url}">`
    } else {
      return `(なし)`
    }
  }
}
