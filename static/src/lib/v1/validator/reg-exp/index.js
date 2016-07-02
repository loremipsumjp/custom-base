export class RegExpValidator {
  initialize({ pattern }) {
    this.pattern = new RegExp(pattern)

    return Promise.resolve(this)
  }

  validate(input) {
    return Promise.resolve(this.pattern.test(input.value))
  }
}
