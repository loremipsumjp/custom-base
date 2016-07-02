import _ from 'lodash'
import co from 'co'
import axios from 'axios'
import { fetchAll } from '../../util/fetch'

export class PieChart {
  async initialize({ id, style, url, include, slices, aggregator, options }) {
    this.id = id
    this.style = style
    this.options = options

    const resources = await fetchAll(url, { include })

    this.slices = slices.map(slice => ({
      legend: slice.legend,
      resources: resources.filter(resource => eval(slice.filter)),
    }))

    const AggregatorClass = _.get(window, aggregator.className)
    
    this.aggregator = await new AggregatorClass().initialize(aggregator.classData)

    for (const slice of this.slices) {
      slice.value = await this.aggregator.aggregate({ resources: slice.resources })
    }

    return this
  }

  async render() {
    return { html: `<div><div style="${this.style}" id="${this.id}"></div></div>` }
  }

  async ready() {
    const array = [['Legend', 'Value']].concat(this.slices.map(slice => [slice.legend, slice.value]))
    const data = new google.visualization.arrayToDataTable(array)

    const chart = new google.visualization.PieChart(document.getElementById(this.id))

    chart.draw(data, this.options)
  }
}
