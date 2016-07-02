import _ from 'lodash'
import co from 'co'

export class ReduceView {
  initialize({ views }) {
    return co(function *() {
      this.views = yield views.map(view => {
        const ViewClass = _.get(window, view.className)
        return new ViewClass().initialize(view.classData)
      })

      return this
    }.bind(this))
  }

  render(options) {
    return co(function *() {
      let memo = yield this.views[0].render(options)

      for (const view of this.views.slice(1)) {
        options.memo = memo
        memo = yield view.render(options)
      }

      return memo
    }.bind(this))
  }
}
