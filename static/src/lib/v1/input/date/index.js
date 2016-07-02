import template from 'jade!./template.jade'

export class DateInput {
  async initialize({ key, path }) {
    this.key = key
    this.path = path

    this.form = {
      value: '',
    }

    return this
  }

  async get() {
    return this.form.value
  }

  async set(value) {
    return this.form.value = value
  }

  async render() {
    return template({ self: this })
  }

  async ready() {
    $(`#${this.key}`).datepicker({
      dateFormat: 'yy-mm-dd',
      dayNamesMin: '日,月,火,水,木,金,土'.split(','),
      monthNamesShort: '1,2,3,4,5,6,7,8,9,10,11,12'.split(','),
      showMonthAfterYear: true,
      changeMonth: true,
      changeYear: true,
    })
  }
}
