/**
 * 开发环境演示：需在 index.html 中挂载 #app，且本地安装 ol
 */
import { MapClass, DEFAULT_BASE_MAPS } from '../src/index.js'

// 使用内置的常用底图列表，也可自定义 baseMaps
const baseMaps = DEFAULT_BASE_MAPS

const map = new MapClass({
  container: document.getElementById('app'),
  center: [116.4, 39.9],
  zoom: 10,
  baseMaps,
  theme: 'light',
  showStatus: true,
  showBaseMapSwitcher: true,
  showStyleControl: true,
  showTimeline: true,
  timelineDateLabel: '2026-02-06',
  timelineStartHour: 7,
  timelineEndHour: 11,
})

window.__map = map
