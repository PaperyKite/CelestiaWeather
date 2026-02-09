import { createMap } from './ol/createMap.js'
import { mountVueApp } from './vue/app.js'

/**
 * 地图类：整合 OpenLayers 与 Vue 3 界面
 * - 初始化时在 container 内创建 OL 地图 + Vue 控件层
 * - ol 为前置依赖，Vue 打包进库
 */
export class MapClass {
  /**
   * @param {object} options
   * @param {HTMLElement|string} options.container - 挂载的 DOM 元素或选择器
   * @param {[number, number]} [options.center=[120, 30]]
   * @param {number} [options.zoom=10]
   * @param {BaseMapItem[]} [options.baseMaps] - 底图列表，每项为 { id?, name?, url, attribution?, minZoom?, maxZoom?, crossOrigin? }
   * @param {import('ol/layer/Base').default[]} [options.layers] - 直接传 OL 图层时优先于 baseMaps
   * @param {string} [options.theme='light'] - 主题：'light' | 'dark'
   * @param {boolean} [options.showStatus=true] - 左下角是否显示层级与鼠标经纬度
   * @param {boolean} [options.showBaseMapSwitcher=true] - 多底图时是否显示底图切换（右侧）
   * @param {boolean} [options.showStyleControl=true] - 是否显示主题/样式控制（右侧）
   * @param {boolean} [options.showDataDisplay=true] - 是否显示数据显示控件（右侧：温度/降水/风速）
   * @param {string} [options.dataDisplayType='temperature'] - 当前数据类型：'temperature' | 'precipitation' | 'wind'
   * @param {boolean} [options.showOverlayToggles=true] - 是否显示右侧三个叠加开关（格点数据/色斑图/站点数据）
   * @param {{ gridData?: boolean, colorPatch?: boolean, stationData?: boolean }} [options.overlayToggles] - 叠加开关初始状态
   * @param {boolean} [options.showTimeline=true] - 是否显示下方居中的时间轴
   * @param {number} [options.timelineMin=0] - 时间轴数值最小值
   * @param {number} [options.timelineMax=100] - 时间轴数值最大值
   * @param {string} [options.timelineDateLabel=''] - 时间轴左侧日期（空则用当天）
   * @param {number} [options.timelineStartHour=7] - 时间轴刻度起始小时（如 7 表示 7时）
   * @param {number} [options.timelineEndHour=11] - 时间轴刻度结束小时（如 11 表示 11时）
   * @param {number} [options.timelinePlayStep=1] - 播放时每次增加的数值
   * @param {number} [options.timelinePlayInterval=200] - 播放间隔（毫秒）
   * @param {boolean} [options.timelineSyncToNowOnMount=false] - 挂载时是否同步到当前真实时间
   */
  constructor(options = {}) {
    const {
      container,
      center = [120, 30],
      zoom = 10,
      baseMaps,
      layers,
      theme = 'light',
      showStatus = true,
      showBaseMapSwitcher = true,
      showStyleControl = true,
      showDataDisplay = true,
      dataDisplayType = 'temperature',
      showOverlayToggles = true,
      overlayToggles = { gridData: false, colorPatch: false, stationData: false },
      showTimeline = true,
      timelineMin = 0,
      timelineMax = 100,
      timelineDateLabel = '',
      timelineStartHour = 7,
      timelineEndHour = 11,
      timelinePlayStep = 1,
      timelinePlayInterval = 200,
      timelineSyncToNowOnMount = false,
    } = options

    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el) {
      throw new Error('MapClass: container 无效或未找到元素')
    }

    this._options = { center, zoom, baseMaps, layers, theme, showStatus, showBaseMapSwitcher, showStyleControl, showDataDisplay, dataDisplayType, showOverlayToggles, overlayToggles, showTimeline, timelineMin, timelineMax, timelineDateLabel, timelineStartHour, timelineEndHour, timelinePlayStep, timelinePlayInterval, timelineSyncToNowOnMount }
    this._container = el
    this._olMap = null
    this._vueApp = null
    this._timelineRef = null
    this._wrapper = null
    this._olTarget = null
    this._uiTarget = null

    this._init()
  }

  _init() {
    const wrapper = document.createElement('div')
    wrapper.className = 'CelestiaWeather-wrapper'
    wrapper.style.cssText = 'position:relative;width:100%;height:100%;'

    const olTarget = document.createElement('div')
    olTarget.className = 'CelestiaWeather-ol'
    olTarget.style.cssText = 'position:absolute;inset:0;'

    const theme = this._options.theme || 'light'
    wrapper.classList.add('CelestiaWeather-wrapper', 'CelestiaWeather-theme-' + theme)
    wrapper.setAttribute('data-theme', theme)

    const uiTarget = document.createElement('div')
    uiTarget.className = 'CelestiaWeather-ui'
    // UI 层整体点击穿透，不阻挡地图操作；子元素（控件）在组件内设 pointer-events: auto 以可点击
    uiTarget.style.cssText = 'position:absolute;inset:0;pointer-events:none;'

    wrapper.appendChild(olTarget)
    wrapper.appendChild(uiTarget)
    this._container.appendChild(wrapper)

    this._wrapper = wrapper
    this._olTarget = olTarget
    this._uiTarget = uiTarget

    this._olMap = createMap({
      container: olTarget,
      center: this._options.center,
      zoom: this._options.zoom,
      baseMaps: this._options.baseMaps,
      layers: this._options.layers,
    })

    const needUi =
      this._options.showStatus ||
      this._options.showStyleControl ||
      this._options.showDataDisplay ||
      this._options.showOverlayToggles ||
      this._options.showTimeline ||
      (this._options.showBaseMapSwitcher &&
        Array.isArray(this._options.baseMaps) &&
        this._options.baseMaps.length > 1)
    if (needUi) {
      this._vueApp = mountVueApp(uiTarget, {
        map: this._olMap,
        baseMaps: this._options.baseMaps ?? [],
        theme: this._options.theme || 'light',
        setTheme: (t) => this._setTheme(t),
        showStatus: this._options.showStatus,
        showBaseMapSwitcher: this._options.showBaseMapSwitcher,
        showStyleControl: this._options.showStyleControl,
        showDataDisplay: this._options.showDataDisplay,
        dataDisplayType: this._options.dataDisplayType,
        showOverlayToggles: this._options.showOverlayToggles,
        overlayToggles: this._options.overlayToggles,
        showTimeline: this._options.showTimeline,
        timelineMin: this._options.timelineMin,
        timelineMax: this._options.timelineMax,
        timelineDateLabel: this._options.timelineDateLabel,
        timelineStartHour: this._options.timelineStartHour,
        timelineEndHour: this._options.timelineEndHour,
        timelinePlayStep: this._options.timelinePlayStep,
        timelinePlayInterval: this._options.timelinePlayInterval,
        timelineSyncToNowOnMount: this._options.timelineSyncToNowOnMount,
        onTimelineReady: (ref) => { this._timelineRef = ref },
      })
    }
  }

  /**
   * 切换主题（供内部 Vue 样式控制组件调用）
   * @param {string} theme - 'light' | 'dark'
   */
  _setTheme(theme) {
    if (!this._wrapper) return
    this._wrapper.setAttribute('data-theme', theme)
    this._wrapper.classList.remove('CelestiaWeather-theme-light', 'CelestiaWeather-theme-dark')
    this._wrapper.classList.add('CelestiaWeather-theme-' + theme)
  }

  /**
   * 获取 OpenLayers Map 实例，供高级用法
   * @returns {import('ol').Map}
   */
  getMap() {
    return this._olMap
  }

  /**
   * 获取时间轴当前时间（需已开启 showTimeline）
   * @returns {{ value: number, time: string, dateTime: string, dateLabel: string, currentHour: number } | undefined}
   */
  getTimelineCurrentTime() {
    return this._timelineRef?.getCurrentTime?.()
  }

  /**
   * 将时间轴同步到当前真实时间（在 startHour~endHour 范围内有效）
   */
  setTimelineToNow() {
    this._timelineRef?.setToNow?.()
  }

  /**
   * 销毁地图与 Vue 应用，释放 DOM
   */
  destroy() {
    if (this._vueApp) {
      this._vueApp.unmount()
      this._vueApp = null
    }
    if (this._olMap) {
      this._olMap.setTarget(undefined)
      this._olMap = null
    }
    if (this._wrapper && this._wrapper.parentNode) {
      this._wrapper.parentNode.removeChild(this._wrapper)
    }
    this._wrapper = null
    this._olTarget = null
    this._uiTarget = null
  }
}
