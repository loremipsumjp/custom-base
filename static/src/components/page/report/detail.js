import _ from 'lodash'
import co from 'co'
import axios from 'axios'

export class ReportDetailPage {
  initialize({ url }) {
    return co(function *() {
      this.resource = (yield axios.get(url)).data
      this.resource.memoLines = this.resource.memo.split('\n')

      const ReportClass = _.get(window, this.resource.className)

      this.report = yield new ReportClass().initialize(this.resource.classData)

      return this
    }.bind(this))
  }

  getVueOptions({ template }) {
    return co(function *() {
      const html = yield this.report.render()
      return {
        data: () => ({
          self: this,
          html,
        }),

        template: template,
      }
    }.bind(this))
  }
}
