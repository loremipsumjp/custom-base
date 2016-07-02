import Mustache from 'mustache'

export class LinkView {
  constructor() {}

  initialize({ text, url }) {
    this.text = text
    this.url = url

    return Promise.resolve(this)
  }

  render(options) {
    const text = Mustache.render(this.text.template, options)
    const url = Mustache.render(this.url.template, options)

    return Promise.resolve(`<a href="${url}">${text}</a>`)
  }
}
