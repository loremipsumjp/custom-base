export class FileNotEmptyValidator {
  initialize() {
    return Promise.resolve(this)
  }

  validate(input) {
    return Promise.resolve(input.form.change === false || input.elements.input.files.length !== 0)
  }
}
