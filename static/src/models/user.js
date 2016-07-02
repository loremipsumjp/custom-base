import co from 'co'
import axios from 'axios'

const siteConfig = require('../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class UserModel {
  initialize(resource) {
    return co(function *() {
      this.form = {
        index: '' + (resource.index || ''),
        profileId: resource.profileId || '',
        username: resource.username || '',
        passwordChange: typeof resource.password === 'undefined',
        password: '',
        name: resource.name || '',
        kana: resource.kana || '',
        memo: resource.memo || '',
      }

      this.validation = {
        index: null,
        profileId: null,
        username: null,
        password: null,
        name: null,
        kana: null,
      }

      this.options = {
        profiles: (yield axios.get(`${baseUrl}/private/api/v1/profiles`, {
          params: { index: 1 },
        })).data,
      }

      this.tableId = null

      return this
    }.bind(this))
  }

  validate() {
    this.validation.index = /^[0-9]+$/.test(this.form.index)
    this.validation.profileId = this.form.profileId !== ''
    this.validation.username = this.form.username !== ''
    this.validation.password = this.form.passwordChange === false || this.form.password !== ''
    this.validation.name = this.form.name !== ''
    this.validation.kana = this.form.kana !== ''

    return Promise.resolve(Object.keys(this.validation).every(key => this.validation[key] === true))
  }

  convert() {
    if (this.tableId === null) {
      throw new Erro('invalid table id')
    }

    var body = {
      tableId: this.tableId,
      index: parseInt(this.form.index, 10),
      profileId: this.form.profileId,
      username: this.form.username,
      password: this.form.password,
      name: this.form.name,
      kana: this.form.kana,
      memo: this.form.memo,
    }

    if (this.form.passwordChanage === false) {
      delete body.password
    }

    return Promise.resolve(body)
  }
}
