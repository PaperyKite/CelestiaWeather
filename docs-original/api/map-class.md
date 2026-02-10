# MapClass API

本文档说明 **MapClass** 的实例化方式与实例方法，便于在业务中正确传参和调用。

---

## 实例化

```js
import { MapClass } from 'CelestiaWeather'

const map = new MapClass(options)
```

- **options**（`Object`）：构造选项，见下方说明。  
- 若 `options.container` 无效或未找到元素，会抛出错误。  
- 构造过程中会：创建容器内 DOM 结构（地图层 + UI 层）、初始化 OpenLayers Map、按需挂载 Vue 控件。

---

## 构造选项（options）

### 必填

| 参数 | 类型 | 说明 |
|------|------|------|
| `container` | `HTMLElement \| string` | 挂载容器：DOM 元素或 CSS 选择器字符串。 |

### 地图与底图

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `center` | `[number, number]` | `[120, 30]` | 地图中心 `[经度, 纬度]`。 |
| `zoom` | `number` | `10` | 缩放级别。 |
| `baseMaps` | `BaseMapItem[]` | — | 底图列表，每项为 XYZ 瓦片配置；多底图时首项默认可见，并显示底图切换。 |
| `layers` | `ol.layer.Base[]` | — | 直接传入 OpenLayers 图层数组时，优先于 `baseMaps`，不再根据 `baseMaps` 创建底图。 |

**BaseMapItem** 常用字段：

- `id`（可选）：底图唯一标识。  
- `name`（可选）：名称，用于 UI。  
- `url`（必填）：XYZ 瓦片 URL，支持 `{x}` `{y}` `{z}` 或 `{z}/{x}/{y}`。  
- `thumbnail`（可选）：缩略图 URL，供底图切换控件显示。  
- `attribution`、`minZoom`、`maxZoom`、`crossOrigin` 等按需设置。

### 主题

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | `'light' \| 'dark'` | `'light'` | 初始主题，可由右侧主题控件切换。 |

### 控件显示开关

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `showStatus` | `boolean` | `true` | 是否显示左下角状态（层级、鼠标经纬度）。 |
| `showBaseMapSwitcher` | `boolean` | `true` | 是否显示右侧底图切换（仅在多底图时有效）。 |
| `showStyleControl` | `boolean` | `true` | 是否显示右侧主题控制（浅色/深色）。 |
| `showDataDisplay` | `boolean` | `true` | 是否显示右侧数据显示控件（温度/降水/风速）。 |
| `dataDisplayType` | `string` | `'temperature'` | 数据显示类型：`'temperature'` \| `'precipitation'` \| `'wind'`。 |
| `showOverlayToggles` | `boolean` | `true` | 是否显示右侧三个叠加开关（格点数据、色斑图、站点数据）。 |
| `overlayToggles` | `Object` | 见下 | 叠加开关初始状态。 |
| `showTimeline` | `boolean` | `true` | 是否显示下方居中时间轴。 |

**overlayToggles** 默认值：

```js
{
  gridData: false,   // 格点数据
  colorPatch: false, // 色斑图
  stationData: false // 站点数据
}
```

### 时间轴

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `timelineMin` | `number` | `0` | 时间轴数值最小值。 |
| `timelineMax` | `number` | `100` | 时间轴数值最大值。 |
| `timelineDateLabel` | `string` | `''` | 时间轴左侧日期文案，空则使用当天。 |
| `timelineStartHour` | `number` | `7` | 刻度起始小时。 |
| `timelineEndHour` | `number` | `11` | 刻度结束小时。 |
| `timelinePlayStep` | `number` | `1` | 播放时每步增加的数值。 |
| `timelinePlayInterval` | `number` | `200` | 播放间隔（毫秒）。 |
| `timelineSyncToNowOnMount` | `boolean` | `false` | 挂载时是否将时间轴同步到当前真实时间。 |

---

## 实例方法

### getMap()

获取底层 OpenLayers Map 实例，用于添加图层、监听事件等高级用法。

```js
const olMap = map.getMap()
// olMap 为 import('ol').Map
```

**返回值**：`import('ol').Map`，未初始化时为 `null`。

---

### getTimelineCurrentTime()

在开启时间轴（`showTimeline: true`）时，获取当前时间轴状态。

```js
const time = map.getTimelineCurrentTime()
// time 形如: { value, time, dateTime, dateLabel, currentHour }
```

**返回值**：`undefined` 或包含 `value`、`time`、`dateTime`、`dateLabel`、`currentHour` 等字段的对象；未显示时间轴或未就绪时为 `undefined`。

---

### setTimelineToNow()

将时间轴同步到当前真实时间（在 `timelineStartHour`～`timelineEndHour` 范围内有效）。仅在已显示时间轴时有效。

```js
map.setTimelineToNow()
```

---

### destroy()

销毁地图与 Vue 应用，移除 DOM、解除引用。页面卸载或不再需要地图时应调用。

```js
map.destroy()
```

调用后，不应再使用该实例；`getMap()` 等将不再可用。

---

## 功能概览（与实例化的对应关系）

| 功能 | 对应选项 / 说明 |
|------|------------------|
| 地图容器与视图 | `container`、`center`、`zoom` |
| 底图来源 | `baseMaps` 或 `layers`，由 `createMap` 生成 OL 图层与 View |
| 主题 | `theme`，内部通过 `_setTheme` 切换 wrapper 的 `data-theme` 与 class |
| 右下控件 | `showBaseMapSwitcher`、`showStyleControl`、`showDataDisplay`、`showOverlayToggles`，由 Vue App 根据 props 渲染 |
| 左下状态 | `showStatus` 控制 MapStatus 显示 |
| 时间轴 | `showTimeline` 及 `timeline*` 选项，通过 `_timelineRef` 暴露 `getTimelineCurrentTime`、`setTimelineToNow` |
| 生命周期 | 构造时 `_init()` 创建 DOM、OL Map、按需挂载 Vue；`destroy()` 卸载 Vue、清空 OL target、移除 wrapper |

以上选项在构造时被合并进内部 `_options`，并传入 Vue 根组件，用于控制各控件的显示与初始状态。
