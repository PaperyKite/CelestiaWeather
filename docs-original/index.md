---
layout: home
hero:
  name: CelestiaWeather
  text: 钦天云图
  tagline: 基于 OpenLayers + Vue 3，一行代码创建地图与完整控件，开箱即用。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: API
      link: /api/map-class
---

<div class="vp-doc" style="margin-top: 48px;">

## 简介

**CelestiaWeather** 提供单一入口 `MapClass`：在指定 DOM 容器内创建 OpenLayers 地图，并挂载底图切换、主题、数据显示、时间轴等 Vue 3 界面。安装本库即可使用，无需单独安装 Vue。

- **地图引擎**：OpenLayers（`ol`），不打包进库，安装本库时会自动安装。
- **界面**：Vue 3 与图标库已打包进库，使用方无需安装。

## 最简示例

```bash
npm install CelestiaWeather
```

```js
import 'CelestiaWeather/style.css'
import { MapClass } from 'CelestiaWeather'

const map = new MapClass({
  container: document.getElementById('map-root'),
  center: [116.4, 39.9],
  zoom: 10,
})
```

更多见 [指南](/guide/) 与 [MapClass API](/api/map-class)。

</div>
