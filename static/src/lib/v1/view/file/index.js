import _ from 'lodash'

export class FileView {
  async initialize({ path }) {
    this.path = path

    return this
  }

  async render(options) {
    const url = _.get(options, this.path)

    if (url) {
      return `<a class="btn btn-default btn-xs" href="${url}?dl=1">ダウンロード</a>`
    } else {
      return `<a class="btn btn-default btn-xs disabled">ダウンロード</a>`
    }
  }
}
