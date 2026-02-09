/**
 * 基于 OpenLayers 创建 Map 实例的纯函数
 * ol 为前置依赖，由使用方安装，此处不打包
 */
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'

/**
 * 从一条 baseMap 配置创建 OL TileLayer（XYZ）
 * @param {BaseMapItem} item
 * @returns {import('ol/layer/Tile').default}
 */
function createBaseMapLayer(item) {
  const source = new XYZ({
    url: item.url,
    maxZoom: item.maxZoom,
    minZoom: item.minZoom,
    crossOrigin: item.crossOrigin ?? 'anonymous',
    ...(item.attribution && { attributions: item.attribution }),
  })
  const layer = new TileLayer({ source })
  if (item.id != null) layer.set('baseMapId', item.id)
  if (item.name != null) layer.set('baseMapName', item.name)
  return layer
}

/**
 * @param {object} options
 * @param {HTMLElement} options.container - 地图挂载的 DOM 元素
 * @param {[number, number]} [options.center=[120, 30]] - 中心点 [经度, 纬度]
 * @param {number} [options.zoom=10] - 缩放级别
 * @param {BaseMapItem[]} [options.baseMaps] - 底图列表，见下方类型；有则用其首项作为底图
 * @param {import('ol/layer/Base').default[]} [options.layers] - 直接传 OL 图层数组时优先于 baseMaps
 * @returns {import('ol').Map}
 */
export function createMap(options) {
  const {
    container,
    center = [120, 30],
    zoom = 10,
    baseMaps = null,
    layers = null,
  } = options

  let viewLayers
  if (Array.isArray(layers) && layers.length > 0) {
    viewLayers = layers
  } else if (Array.isArray(baseMaps) && baseMaps.length > 0) {
    viewLayers = baseMaps.map((item, i) => {
      const layer = createBaseMapLayer(item)
      // 多底图时仅首项默认可见，供底图切换组件使用
      layer.setVisible(i === 0)
      return layer
    })
  } else {
    viewLayers = [new TileLayer({ source: new OSM() })]
  }

  const view = new View({
    center: fromLonLat(center),
    zoom,
  })

  // 不使用 OL 默认控件，所有控件由库内 Vue 层自行实现
  const map = new Map({
    target: container,
    layers: viewLayers,
    view,
    controls: [],
  })

  return map
}

/**
 * 底图项数据结构（baseMaps 列表元素）
 * @typedef {object} BaseMapItem
 * @property {string} [id] - 底图唯一标识，用于后续切换等
 * @property {string} [name] - 底图名称，用于 UI 展示
 * @property {string} url - XYZ 瓦片地址，支持 {x} {y} {z} 占位符
 * @property {string} [thumbnail] - 缩略图地址，供底图切换控件展示
 * @property {string} [attribution] - 版权信息
 * @property {number} [minZoom] - 最小层级
 * @property {number} [maxZoom] - 最大层级
 * @property {string} [crossOrigin] - 跨域模式，默认 'anonymous'
 */
