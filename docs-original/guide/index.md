# 指南

本页说明如何在项目中使用 **CelestiaWeather**：从安装、引入到创建地图、配置底图与控件，以及获取 OpenLayers 实例与销毁。

---

## 安装

确保已安装 **Node.js**，在项目中执行：

```bash
npm install CelestiaWeather
```

- **ol**（OpenLayers）：不打包进库，安装本库时会自动安装。
- **Vue**、**lucide-vue-next**：已打包进库，使用方无需安装。

---

## 引入样式与类

在入口文件（或需要用到地图的模块）中引入样式与类：

```js
import 'CelestiaWeather/style.css'
import { MapClass } from 'CelestiaWeather'
```

若使用 ESM 且未打包，需保证运行环境能正确处理 CSS 引用；在 Vite、Webpack 等构建环境中直接按上述方式引入即可。

---

## 创建地图

准备一个具备宽高的 DOM 容器（例如 `#map-root`），然后传入 `container` 与可选的地图参数：

```js
const map = new MapClass({
  container: document.getElementById('map-root'), // 或 '#map-root'
  center: [116.4, 39.9],
  zoom: 10,
})
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `container` | 是 | 挂载的 DOM 元素或 CSS 选择器字符串。 |
| `center` | 否 | 地图中心 `[经度, 纬度]`，默认 `[120, 30]`。 |
| `zoom` | 否 | 缩放级别，默认 `10`。 |

地图会填满该容器；请为容器设置好宽高（如 `width: 100%; height: 400px`），否则可能看不到地图。

---

## 使用底图列表

可传入 `baseMaps` 使用自定义底图或库提供的默认底图列表。多底图时，首项默认可见，右侧会显示底图切换控件：

```js
import { MapClass, DEFAULT_BASE_MAPS } from 'CelestiaWeather'

const map = new MapClass({
  container: '#map-root',
  baseMaps: DEFAULT_BASE_MAPS,
  center: [116.4, 39.9],
  zoom: 10,
})
```

`DEFAULT_BASE_MAPS` 包含高德、高德卫星、OpenStreetMap 等示例配置，可直接使用或在此基础上修改。

---

## 控件开关

通过选项控制是否显示各类 UI，默认均为开启：

| 选项 | 说明 | 默认 |
|------|------|------|
| `showStatus` | 左下角层级与鼠标经纬度 | `true` |
| `showBaseMapSwitcher` | 右侧底图切换（多底图时） | `true` |
| `showStyleControl` | 右侧主题（浅色/深色） | `true` |
| `showDataDisplay` | 右侧数据显示（温度/降水/风速） | `true` |
| `showOverlayToggles` | 右侧叠加开关（格点/色斑图/站点） | `true` |
| `showTimeline` | 下方时间轴 | `true` |

例如只保留底图与状态信息，关闭其余控件：

```js
const map = new MapClass({
  container: '#map-root',
  showStyleControl: false,
  showDataDisplay: false,
  showOverlayToggles: false,
  showTimeline: false,
})
```

---

## 获取 OL 实例与销毁

需要直接操作 OpenLayers（如添加图层、监听事件）时，使用 `getMap()`：

```js
const olMap = map.getMap()
// 例如：olMap.addLayer(...)、olMap.on('click', ...) 等
```

页面卸载或不再需要地图时，请调用 `destroy()` 释放资源：

```js
map.destroy()
```

调用后不应再使用该实例；`getMap()` 等将不再可用。

---

## 下一步

- [MapClass API](/api/map-class) — 完整构造选项与实例方法。
