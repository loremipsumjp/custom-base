import qs from 'qs'
import axios from 'axios'
import template from 'jade!./template.jade'

const siteConfig = require('../../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export class AddColumnTool {
  async initialize() {
    const query = qs.parse(window.location.search.slice(1))

    this.form = {
      tableKey: query.tableKey || '',
      name: query.name || '',
      key: query.key || '',
      dataType: query.dataType || 'string',
      formType: query.formType || 'text',
    }

    this.validation = {
      tableKey: null,
      name: null,
      key: null,
      dataType: null,
      formType: null,
    }

    this.tables = (await axios.get(`${baseUrl}/private/api/v1/tables`, {
      params: {
        sort: { index: 1 },
      },
    })).data

    this.tablesByKey = this.tables.reduce((memo, table) => {
      memo[table.key] = table
      return memo
    }, {})

    return this
  }

  async render() {
    return template({ self: this })
  }

  async ready() {}

  async onClick(event) {
    event.preventDefault()

    if (await this.validate() === false) {
      return
    }

    const lastColumn = (await axios.get(`${baseUrl}/private/api/v1/columns`, {
      params: {
        query: { tableId: this.tablesByKey[this.form.tableKey]._id },
        sort: { index: -1 },
        limit: 1,
      },
    })).data[0]

    const newColumn = {
      index: lastColumn.index + 1,
      name: this.form.name,
      key: this.form.key,
      type: this.form.dataType,
      memo: '',
      tableId: this.tablesByKey[this.form.tableKey]._id,
    }

    await axios.post(`${baseUrl}/private/api/v1/columns`, newColumn)

    const pages = (await axios.get(`${baseUrl}/private/api/v1/pages`, {
      params: {
        query: { tableId: this.tablesByKey[this.form.tableKey]._id },
        sort: { index: 1 },
      },
    })).data

    pages.forEach(async page => {
      if (page.key === 'form') {
        await this.onPageForm({ page })
      } else if (page.key === 'detail') {
        await this.onPageDetail({ page })
      }
    })

    window.location.href = '../'
  }

  async validate() {
    this.validation.tableKey = this.form.tableKey !== ''
    this.validation.name = this.form.name !== ''
    this.validation.key = this.form.key !== ''
    this.validation.dataType = this.form.dataType !== ''
    this.validation.formType = this.form.formType !== ''

    return Object.keys(this.validation).every(key => this.validation[key] === true)
  }

  async onPageForm({ page }) {
    const firstPanel = page.classData.panels[0]
    const className = 
      (this.form.formType === 'text' && this.form.dataType === 'number') ? 'lib.v1.input.NumberInput' :
      (this.form.formType === 'text' && this.form.dataType === 'string') ? 'lib.v1.input.TextInput' :
      (this.form.formType === 'textarea') ? 'lib.v1.input.TextAreaInput' :
      (this.form.formType === 'date') ? 'lib.v1.input.DateInput' :
      (this.form.formType === 'file') ? 'lib.v1.input.FileInput' : null
    const classData = { key: this.form.key }

    firstPanel.rows.push({
      name: this.form.name,
      key: this.form.key,
      input: {
        className: className,
        classData: classData,
      },
      validation: {
        rules: [],
      },
    })

    await axios.put(`${baseUrl}/private/api/v1/pages/${page._id}`, page)
  }

  async onPageDetail({ page }) {
    const firstPanel = page.classData.panels[0]
    const className = 
      (this.form.formType === 'text') ? 'lib.v1.view.TextView' :
      (this.form.formType === 'textarea') ? 'lib.v1.view.TextAreaView' :
      (this.form.formType === 'date') ? 'lib.v1.view.DateView' :
      (this.form.formType === 'file') ? 'lib.v1.view.FileView' : null
    const classData = (this.form.formType === 'date')
      ? { path: `resource.${this.form.key}`, format: '{{ uy }}年{{ um }}月{{ ud }}日({{ uaaa }})' }
      : { path: `resource.${this.form.key}` }

    firstPanel.rows.push({
      name: this.form.name,
      view: {
        className: className,
        classData: classData,
      },
    })

    await axios.put(`${baseUrl}/private/api/v1/pages/${page._id}`, page)
  }

  async getVueOptions() {
    return {
      data: () => ({ self: this }),

      methods: {
        onClick: event => this.onClick(event).catch(err => console.error(err.stack || err)),
      },

      template: await this.render(),
    }
  }
}
