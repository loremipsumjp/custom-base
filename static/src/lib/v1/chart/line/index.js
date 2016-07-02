import _ from 'lodash'
import co from 'co'
import axios from 'axios'
import { fetchAll } from '../../util/fetch'

export class LineChart {
  async initialize({ id, style, url, include, axis, lines, aggregator, options }) {
    this.id = id
    this.style = style
    this.options = options

    const resources = await fetchAll(url, { include })

    this.axis = axis
    this.lines = lines.map(line => ({
      legend: line.legend,
      points: this.axis.x.points.map(point => {
        const x = point.options

        return {
          resources: resources.filter(resource => eval(line.filter)),
        }
      }),
    }))

    const AggregatorClass = _.get(window, aggregator.className)
    
    this.aggregator = await new AggregatorClass().initialize(aggregator.classData)

    for (const line of this.lines) {
      for (const point of line.points) {
        point.value = await this.aggregator.aggregate({ resources: point.resources })
      }
    }

    return this
  }

  async render() {
    return { html: `<div style='${this.style}' id="${this.id}"></div>` }
  }

  async ready() {
    const array = [['Label'].concat(this.lines.map(line => line.legend))]

    this.axis.x.points.forEach((point, i) => {
      const row = [point.legend].concat(this.lines.map(line => line.points[i].value))

      array.push(row)
    })

    const data = new google.visualization.arrayToDataTable(array)
    const chart = new google.visualization.LineChart(document.getElementById(this.id))

    chart.draw(data, this.options)
  }
}
