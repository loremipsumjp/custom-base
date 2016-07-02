import co from 'co'
import style from 'raw!./style.css'
import template from 'jade!./template.jade'

export class PreviewFormat {
  async initialize({ data, template, style }) {
    this.template = template

    const styleTag = document.createElement('style')
    styleTag.innerText = style
    document.head.appendChild(styleTag)

    const formatStyleTag = document.createElement('style')
    formatStyleTag.innerText = style
    document.head.appendChild(formatStyleTag)

    return this
  }

  async getVueOptions({ resource }) {
    return {
      template: await this.render({ resource })
    }
  }

  async render({ resource }) {
    return template({ html: ejs.render(this.template, resource) })
  }
}
