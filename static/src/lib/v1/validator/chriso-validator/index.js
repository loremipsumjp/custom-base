import validator from 'validator'

export class ChrisoValidator {
  initialize({ method }) {
    this.method = method

    return Promise.resolve(this)
  }

  validate(input) {
    return Promise.resolve(validator[this.method](input.value) === true)
  }
}
