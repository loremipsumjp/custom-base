import _ from 'lodash'
import co from 'co'
import axios from 'axios'

export class ToolDetailPage {
  async initialize({ url }) {
    this.resource = (await axios.get(url)).data
    this.resource.memoLines = this.resource.memo.split('\n')

    const ToolClass = _.get(window, this.resource.className)

    this.tool = await new ToolClass().initialize(this.resource.classData)

    return this
  }

  async getVueOptions({ template }) {
    return {
      data: () => ({ self: this }),

      template: template,

      components: { tool: await this.tool.getVueOptions() },
    }
  }
}
