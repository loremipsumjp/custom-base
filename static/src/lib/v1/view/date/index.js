import _ from 'lodash'
import Mustache from 'mustache'

export class DateView {
  constructor() {}

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
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const uy = date.getUTCFullYear()
    const um = date.getUTCMonth() + 1
    const ud = date.getUTCDate()
    const hh = ('0' + date.getHours()).slice(-2)
    const mm = ('0' + date.getMinutes()).slice(-2)
    const aaa = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
    const uaaa = ['日', '月', '火', '水', '木', '金', '土'][date.getUTCDay()]

    return Mustache.render(this.format, { y, m, d, uy, um, ud, hh, mm, aaa, uaaa })
  }
}
