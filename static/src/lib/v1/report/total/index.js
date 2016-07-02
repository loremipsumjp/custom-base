import _ from 'lodash'
import axios from 'axios'
import template from 'jade!./template.jade'

export class TotalReport {
  async initialize({ url, columns }) {
    const query = JSON.parse(url.querystring)

    this.resources = (await axios.get(url.pathname, { params: query })).data
    this.columns = await Promise.all(columns.map(column => new Column().initialize(column)))

    return this
  }

  async render() {
    return template({
      self: this,
      rows: await Promise.all(this.resources.map(resource => this.renderRow({ resource }))),
      footer: {
        columns: await Promise.all(this.columns.map(column => column.aggregate({ resources: this.resources }))),
      },
    })
  }

  async renderRow({ resource }) {
    return {
      resource,
      columns: await Promise.all(this.columns.map(column => column.render({ resource }))),
    }
  }
}

class Column {
  async initialize({ name, view, stats }) {
    stats = stats || []

    this.name = name

    const ViewClass = _.get(window, view.className)

    this.view = await new ViewClass().initialize(view.classData)
    this.stats = await Promise.all(stats.map(stat => new Stat().initialize(stat)))

    return this
  }

  async render(options) {
      return { html: await this.view.render(options) }
  }

  async aggregate(options) {
    return {
      stats: await Promise.all(this.stats.map(stat => stat.aggregate(options))),
    }
  }
}

class Stat {
  async initialize({ name, aggregator, view }) {
    this.name = name

    const AggregatorClass = _.get(window, aggregator.className)
    const ViewClass = _.get(window, view.className)

    this.aggregator = await new AggregatorClass().initialize(aggregator.classData)
    this.view = await new ViewClass().initialize(view.classData)

    return this
  }

  async aggregate(options) {
    const result = await this.aggregator.aggregate(options)
    const html = await this.view.render({ result })

    return {
      name: this.name,
      html: html,
    }
  }
}
