import _ from 'lodash'
import co from 'co'
import axios from 'axios'
import { fetchAll } from '../../util/fetch'

export class GeoChart {
  async initialize({ id, style, label, url, include, province, aggregator, options }) {
    this.id = id
    this.style = style
    this.label = label
    this.resources = await fetchAll(url, { include })

    this.provincesByName = this.resources.reduce((memo, resource) => {
      const name = _.get({ resource }, province.path)

      memo[name] = memo[name] || { name, resources: [] }
      memo[name].resources.push(resource)

      return memo
    }, {
      '北海道': { name: '北海道', resources: [] },
      '青森': { name: '青森', resources: [] },
      '岩手': { name: '岩手', resources: [] },
      '宮城': { name: '宮城', resources: [] },
      '秋田': { name: '秋田', resources: [] },
      '山形': { name: '山形', resources: [] },
      '福島': { name: '福島', resources: [] },
      '茨城': { name: '茨城', resources: [] },
      '栃木': { name: '栃木', resources: [] },
      '群馬': { name: '群馬', resources: [] },
      '埼玉': { name: '埼玉', resources: [] },
      '千葉': { name: '千葉', resources: [] },
      '東京': { name: '東京', resources: [] },
      '神奈川': { name: '神奈川', resources: [] },
      '新潟': { name: '新潟', resources: [] },
      '富山': { name: '富山', resources: [] },
      '石川': { name: '石川', resources: [] },
      '福井': { name: '福井', resources: [] },
      '山梨': { name: '山梨', resources: [] },
      '長野': { name: '長野', resources: [] },
      '岐阜': { name: '岐阜', resources: [] },
      '静岡': { name: '静岡', resources: [] },
      '愛知': { name: '愛知', resources: [] },
      '三重': { name: '三重', resources: [] },
      '滋賀': { name: '滋賀', resources: [] },
      '京都': { name: '京都', resources: [] },
      '大阪': { name: '大阪', resources: [] },
      '兵庫': { name: '兵庫', resources: [] },
      '奈良': { name: '奈良', resources: [] },
      '和歌山': { name: '和歌山', resources: [] },
      '鳥取': { name: '鳥取', resources: [] },
      '島根': { name: '島根', resources: [] },
      '岡山': { name: '岡山', resources: [] },
      '広島': { name: '広島', resources: [] },
      '山口': { name: '山口', resources: [] },
      '徳島': { name: '徳島', resources: [] },
      '香川': { name: '香川', resources: [] },
      '愛媛': { name: '愛媛', resources: [] },
      '高知': { name: '高知', resources: [] },
      '福岡': { name: '福岡', resources: [] },
      '佐賀': { name: '佐賀', resources: [] },
      '長崎': { name: '長崎', resources: [] },
      '熊本': { name: '熊本', resources: [] },
      '大分': { name: '大分', resources: [] },
      '宮崎': { name: '宮崎', resources: [] },
      '鹿児島': { name: '鹿児島', resources: [] },
      '沖縄': { name: '沖縄', resources: [] },
    })

    this.provinces = Object.keys(this.provincesByName).map(name => this.provincesByName[name])

    const AggregatorClass = _.get(window, aggregator.className)

    this.aggregator = await new AggregatorClass().initialize(aggregator.classData)

    for (const province of this.provinces) {
      province.value = await this.aggregator.aggregate({ resources: province.resources })
    }

    this.options = options

    return this
  }

  async render() {
    return { html: `<div id="${this.id}" style="${this.style}"></div>` }
  }

  async ready() {
    const array = [['Province', this.label]].concat(this.provinces.map(province => [province.name, province.value]))
    const data = new google.visualization.arrayToDataTable(array)
    const chart = new google.visualization.GeoChart(document.getElementById(this.id))

    chart.draw(data, this.options)
  }
}
