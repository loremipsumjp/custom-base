import _ from 'lodash'

export class ExpressionView {
  initialize({ formula }) {
    this.formula = formula

    return Promise.resolve(this)
  }

  render({ resource, memo }) {
    return Promise.resolve(eval(this.formula))
  }
}
