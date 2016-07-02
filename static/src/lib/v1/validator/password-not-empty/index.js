export class PasswordNotEmptyValidator {
  async initialize() {
    return this
  }

  async validate(input) {
    return input.change === false || input.value !== ''
  }
}
