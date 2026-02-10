# CelestiaWeather（钦天云图）

基于 **OpenLayers** 的地图类库，Vue 3 界面已打包进库，一行代码创建地图与完整控件，开箱即用。

---

## 简介

**CelestiaWeather** 提供单一入口 `MapClass`：在指定 DOM 容器内创建 OpenLayers 地图，并挂载底图切换、主题、数据显示、时间轴等 Vue 3 界面。

- **ol**（OpenLayers）：不打包进库，安装本库时会自动安装。
- **Vue**、**lucide-vue-next**：已打包进库，使用方无需安装。

---

## 快速开始

### 安装

```bash
npm install CelestiaWeather
```

### 最简示例

准备具备宽高的容器（如 `#map-root`），引入样式与类并创建实例：

```js
import 'CelestiaWeather/style.css'
import { MapClass } from 'CelestiaWeather'

const map = new MapClass({
  container: document.getElementById('map-root'),
  center: [116.4, 39.9],
  zoom: 10,
})

const olMap = map.getMap()  // 需要时获取 OL 实例
map.destroy()               // 页面卸载时销毁
```

更多参数见 [指南](/guide/) 与 [MapClass API](/api/map-class)。

---

## 文档导航

- [**指南**](/guide/) — 安装、引入、创建地图、底图与控件、获取 OL 实例与销毁。
- [**MapClass API**](/api/map-class) — 构造选项与实例方法。
