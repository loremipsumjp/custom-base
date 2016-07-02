import _ from 'lodash'
import co from 'co'
import template from 'jade!./template.jade'

export class ChartDashboard {
  async initialize({ rows }) {
    this.rows = await Promise.all(rows.map(row => new Row().initialize(row)))

    await new Promise(resolve => {
      google.charts.load('current', { packages: ['gauge'] })
      google.charts.setOnLoadCallback(resolve)
    })

    return this
  }

  async getVueOptions() {
    return {
      template: await this.render(),
    }
  }

  async render() {
    return template({
      self: this,
      rows: await Promise.all(this.rows.map(row => row.render())),
    })
  }

  async ready() {
    this.rows.forEach(row => row.ready())
  }
}

class Row {
  async initialize({ columns }) {
    this.columns = await Promise.all(columns.map(column => new Column().initialize(column)))

    return this
  }

  async render() {
    return {
      columns: await Promise.all(this.columns.map(column => column.render())),
    }
  }

  async ready() {
    this.columns.forEach(column => column.ready())
  }
}

class Column {
  async initialize({ panel }) {
    this.panel = await new Panel().initialize(panel)

    return this
  }

  async render() {
    return {
      panel: await this.panel.render(),
    }
  }

  async ready() {
    this.panel.ready()
  }
}

class Panel {
  async initialize({ name, chart }) {
    this.name = name

    const ChartClass = _.get(window, chart.className)

    this.chart = await new ChartClass().initialize(chart.classData)

    return this
  }

  async render() {
    return {
      name: this.name,
      chart: await this.chart.render(),
    }
  }

  async ready() {
    this.chart.ready()
  }
}
