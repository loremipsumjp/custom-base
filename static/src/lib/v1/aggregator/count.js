export class CountAggregator {
  async initialize() {
    return this
  }

  async aggregate({ resources }) {
    return resources.length
  }
}
