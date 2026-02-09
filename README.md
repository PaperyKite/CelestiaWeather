# CelestiaWeather（钦天云图）

基于 **OpenLayers** 的地图类库，使用 **Vue 3** 构建界面，开箱即用。

## 特性

- 基于 OpenLayers，支持常见地图与图层能力
- Vue 3 与界面依赖已打包进库，使用方无需单独安装 Vue
- 提供地图容器、缩放、比例尺等常用控件

## 安装

- **ol**（OpenLayers）：不打包进库，安装本库时会自动安装，运行时由本库依赖的 `ol` 提供。
- **Vue**、**lucide-vue-next**：已打包进库，使用方无需安装。

```bash
npm install celestia-weather
```

## 快速开始

1. 引入样式与地图类：

```js
import 'celestia-weather/style.css'
import { MapClass } from 'celestia-weather'
```

2. 创建地图实例：

```js
const map = new MapClass({
  container: document.getElementById('map-root'),  // 挂载的 DOM 元素
  center: [116.4, 39.9],   // 中心点 [经度, 纬度]
  zoom: 10,                 // 缩放级别
  showControls: true,       // 是否显示控件
  showScale: true,          // 是否显示比例尺
})

// 获取底层 OpenLayers Map 实例，进行更多操作
const olMap = map.getMap()
```

3. 不再使用时销毁：

```js
map.destroy()
```

## 配置说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `container` | `HTMLElement` | 地图挂载的 DOM 元素 |
| `center` | `[number, number]` | 地图中心 [经度, 纬度] |
| `zoom` | `number` | 初始缩放级别 |
| `showControls` | `boolean` | 是否显示缩放等控件 |
| `showScale` | `boolean` | 是否显示比例尺 |

通过 `map.getMap()` 可拿到 OpenLayers 的 `Map` 实例，用于添加图层、矢量、交互等进阶功能。

## License

见仓库内 [LICENSE](LICENSE) 文件。
