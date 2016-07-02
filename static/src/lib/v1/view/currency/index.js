import _ from 'lodash'

export class CurrencyView {
  initialize({ path, rate }) {
    this.path = path
    this.rate = typeof rate === 'number' ? rate : 1

    return Promise.resolve(this)
  }

  render(options) {
    return Promise.resolve('&yen;' + Math.floor(_.get(options, this.path) * this.rate).toString().split('').reverse().map((digit, i) => i !== 0 && i % 3 === 0 ? digit + ',' : digit).reverse().join(''))
  }
}
