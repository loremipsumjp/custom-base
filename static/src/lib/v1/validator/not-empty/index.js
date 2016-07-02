export class NotEmptyValidator {
  async initialize() {
    return this
  }

  async validate(input) {
    return input.value !== ''
  }
}
