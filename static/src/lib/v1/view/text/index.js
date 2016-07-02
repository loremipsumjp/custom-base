import _ from 'lodash'

export class TextView {
  initialize({ path, prefix, postfix }) {
    this.path = path
    this.prefix = prefix || ''
    this.postfix = postfix || ''

    return Promise.resolve(this)
  }

  render(options) {
    return Promise.resolve(this.prefix + _.get(options, this.path) + this.postfix)
  }
}
