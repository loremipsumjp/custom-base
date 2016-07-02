export class AverageAggregator {
  async initialize({ path, formula }) {
    this.path = path || null
    this.formula = formula || null

    return this
  }

  async aggregate({ resources }) {
    return resources.reduce((memo, resource) => {
      if (this.path !== null) {
        memo += _.get(resource, this.path)
      } else if (this.formula !== null) {
        memo += eval(this.formula)
      }

      return memo
    }, 0) / resources.length
  }
}
