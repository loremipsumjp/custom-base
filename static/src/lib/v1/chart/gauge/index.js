import _ from 'lodash'
import co from 'co'
import axios from 'axios'

export class GaugeChart {
  async initialize({ id, style, label, url, aggregator, options }) {
    this.id = id
    this.style = style
    this.label = label || ''

    this.resources = (await axios.get(url.pathname, { params: JSON.parse(url.query) })).data

    const AggregatorClass = _.get(window, aggregator.className)

    this.aggregator = await new AggregatorClass().initialize(aggregator.classData)
    this.options = options

    return this
  }

  async render() {
    return { html: `<div style="${this.style}"><div id="${this.id}"></div></div>` }
  }

  async ready() {
    const result = await this.aggregator.aggregate({ resources: this.resources })

    const data = new google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      [this.label, result],
    ])

    const chart = new google.visualization.Gauge(document.getElementById(this.id))

    chart.draw(data, this.options)
  }
}
