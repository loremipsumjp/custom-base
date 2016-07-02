import _ from 'lodash'

export class VideoView {
  async initialize({ path }) {
    this.path = path

    return this
  }

  async render(options) {
    const url = _.get(options, this.path)

    if (url) {
      return `<video src="${url}" controls>`
    } else {
      return `(なし)`
    }
  }
}
