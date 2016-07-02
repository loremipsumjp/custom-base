import _ from 'lodash'
import co from 'co'
import template from 'jade!./template.jade'

export class HomePage {
  initialize({ name, rows }) {
    return co(function *() {
      this.name = name
      this.rows = yield rows.map(row => new Row().initialize(row))

      yield new Promise(resolve => {
        google.charts.load('current', { packages: ['corechart', 'line', 'gauge', 'geochart'] })
        google.charts.setOnLoadCallback(resolve)
      })

      return this
    }.bind(this))
  }

  getVueOptions() {
    return co(function *() {
      return {
        data: () => ({ self: this }),

        ready: () => this.ready(),

        template: yield this.render()
      }
    }.bind(this))
  }

  render() {
    return co(function *() {
      return template({
        self: this,
        rows: yield this.rows.map(row => row.render()),
      })
    }.bind(this))
  }

  ready() {
    this.rows.forEach(row => row.ready())
  }
}

class Row {
  initialize({ columns }) {
    return co(function *() {
      this.columns = yield columns.map(column => new Column().initialize(column))

      return this
    }.bind(this))
  }

  ready() {
    this.columns.forEach(column => column.ready())
  }

  render() {
    return co(function *() {
      return { columns: yield this.columns.map(column => column.render()) }
    }.bind(this))
  }
}

class Column {
  initialize({ css, panels }) {
    return co(function *() {
      this.css = css
      this.panels = yield panels.map(panel => new Panel().initialize(panel))

      return this
    }.bind(this))
  }

  ready() {
    this.panels.forEach(panel => panel.ready())
  }

  render() {
    return co(function *() {
      return {
        css: this.css,
        panels: yield this.panels.map(panel => panel.render()),
      }
    }.bind(this))
  }
}

class Panel {
  initialize({ name, widget }) {
    return co(function *() {
      this.name = name

      const WidgetClass = _.get(window, widget.className)

      this.widget = yield new WidgetClass().initialize(widget.classData)

      return this
    }.bind(this))
  }

  ready() {
    this.widget.ready()
  }

  render() {
    return co(function *() {
      return {
        name: this.name,
        widget: yield this.widget.render(),
      }
    }.bind(this))
  }
}
