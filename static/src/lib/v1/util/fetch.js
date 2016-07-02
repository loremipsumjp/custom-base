import co from 'co'
import axios from 'axios'

const siteConfig = require('../../../config/site')[ENV]
const baseUrl = siteConfig.baseUrl

export function fetchOne(url, options) {
  return co(function *() {
    options = options || {}

    const include = options.include || []

    const resource = (yield axios.get(url2str(url))).data
    const pattern = new RegExp(`^${baseUrl}/private/api/v1/custom-objects/([a-z][0-9a-z\\-]*)/[0-9a-f]{24}`)
    const match = pattern.exec(url2str(url))
    const tableKey = match[1]
    const table = (yield axios.get(`${baseUrl}/private/api/v1/tables/find-by-key/${tableKey}`)).data
    const relationshipsByKey = table.association.relationships.reduce((memo, relationship) => {
      memo[relationship.key] = relationship
      return memo
    }, {})

    for (const item of include) {
      const relationship = relationshipsByKey[item.key]

      if (relationship.type === 'belongs-to') {
        const parentId = resource[relationship.column.key]
        const isParentIdNull = typeof parentId === 'undefined' || parentId === null || parentId === ''

        const parentUrl = `${baseUrl}/private/api/v1/custom-objects/${relationship.table.key}/${parentId}`
        const parentResource = isParentIdNull ? null : yield fetchOne(parentUrl, { include: item.include })

        resource[item.key] = parentResource
      } else if (relationship.type === 'has-many') {
        const query = {}

        query[relationship.column.key] = resource._id

        const childUrl = {
          pathname: `${baseUrl}/private/api/v1/custom-objects/${relationship.table.key}`,
          query: { query },
        }

        const childResources = yield fetchAll(childUrl, { include: item.include })

        resource[item.key] = childResources
      }
    }

    return resource
  })
}

export function fetchAll(url, options) {
  return co(function *() {
    options = options || {}

    const include = options.include || []

    const resources = (yield axios.get(url2str(url))).data
    const pattern = new RegExp(`^${baseUrl}/private/api/v1/custom-objects/([a-z][a-z0-9\-]*)`)
    const match = pattern.exec(url2str(url))
    const tableKey = match[1]
    const table = (yield axios.get(`${baseUrl}/private/api/v1/tables/find-by-key/${tableKey}`)).data
    const relationshipsByKey = table.association.relationships.reduce((memo, relationship) => {
      memo[relationship.key] = relationship
      return memo
    }, {})

    for (const item of include) {
      const relationship = relationshipsByKey[item.key]

      if (relationship.type === 'belongs-to') {
        for (const resource of resources) {
          const parentId = resource[relationship.column.key]
          const isParentIdNull = typeof parentId === 'undefined' || parentId === null || parentId === ''

          const parentUrl = `${baseUrl}/private/api/v1/custom-objects/${relationship.table.key}/${parentId}`
          const parentResource = isParentIdNull ? null : yield fetchOne(parentUrl, { include: item.include })

          resource[item.key] = parentResource
        }
      } else if (relationship.type === 'has-many') {
        for (const resource of resources) {
          const query = {}

          query[relationship.column.key] = resource._id

          const childUrl = {
            pathname: `${baseUrl}/private/api/v1/custom-objects/${relationship.table.key}`,
            query: { query },
          }

          const childResources = yield fetchAll(childUrl, { include: item.include })

          resource[item.key] = childResources
        }
      }
    }

    return resources
  })
}

function url2str(url) {
  if (typeof url === 'string') {
    return url
  } else if (typeof url === 'object') {
    const pathname = url.pathname
    const search = '?' + Object.keys(url.query)
      .map(key => {
        const value = url.query[key]

        if (typeof value === null) {
          return { key: key, value: '' }
        } else if (typeof value === 'object') {
          return { key: key, value: JSON.stringify(value) }
        } else {
          return { key, value }
        }
      })
      .map(pair => `${pair.key}=${encodeURIComponent(pair.value)}`)
      .join('&')

    return `${pathname}${search}`
  } else {
    throw new TypeError('invalid type: ' + typeof url)
  }
}
