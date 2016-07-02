import _ from 'lodash'
import co from 'co'

export class ChartWidget {
  initialize({ chart }) {
    return co(function *() {
      const ChartClass = _.get(window, chart.className)

      this.chart = yield new ChartClass().initialize(chart.classData)

      return this
    }.bind(this))
  }

  render() {
    return co(function *() {
      return yield this.chart.render()
    }.bind(this))
  }

  ready() {
    this.chart.ready()
  }
}
