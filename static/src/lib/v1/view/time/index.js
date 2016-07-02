import _ from 'lodash'
import Mustache from 'mustache'

export class TimeView {
  constructor() {}

  initialize({ path, format }) {
    this.path = path
    this.format = format

    return Promise.resolve(this)
  }

  render(options) {
    const time = _.get(options, this.path)
    const [hh, mm, ss] = time.split(':')

    return Promise.resolve(Mustache.render(this.format, { hh, mm, ss }))
  }
}
