import _ from 'lodash'
import Mustache from 'mustache'

export class DateOnlyView {
  async initialize({ path, format }) {
    this.path = path
    this.format = format

    return this
  }

  async render(options) {
    const value = _.get(options, this.path)

    if (!value) {
      return '-'
    }

    const date = new Date(value)

    const y = date.getUTCFullYear()
    const m = date.getUTCMonth() + 1
    const d = date.getUTCDate()
    const aaa = ['日', '月', '火', '水', '木', '金', '土'][date.getUTCDay()]

    return Mustache.render(this.format, { y, m, d, aaa })
  }
}
