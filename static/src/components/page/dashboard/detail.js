import _ from 'lodash'
import co from 'co'
import axios from 'axios'

export class DashboardDetailPage {
  async initialize({ url }) {
    this.resource = (await axios.get(url)).data
    this.resource.memoLines = this.resource.memo.split('\n')

    const DashboardClass = _.get(window, this.resource.className)

    this.dashboard = await new DashboardClass().initialize(this.resource.classData)

    return this
  }

  async getVueOptions({ template }) {
    return {
      data: () => ({
        self: this,
      }),

      ready: () => this.dashboard.ready(),

      template: template,

      components: {
        dashboard: await this.dashboard.getVueOptions(),
      },
    }
  }
}
