# 地图类库设计文档（Vite 库模式）

## 1. 概述

本库提供一种可发布到 npm 的**地图类**，基于 **OpenLayers** 实现地图能力，界面层由 **Vue 3** 构建并打包进库内。使用 **Vite** 的库模式进行构建，面向 JavaScript 使用者。

### 1.1 目标

- 单一入口：通过 `new MapClass(options)` 初始化。
- 核心地图：依赖 **OpenLayers**（`ol`），不打包进库，安装本库时自动安装。
- 界面：Vue 3 与 lucide-vue-next 打包进库，使用方无需安装。
- 构建：Vite 库模式，产出 ESM + UMD + CSS。

## 2. 技术架构

### 2.1 依赖策略

| 依赖        | 角色           | 说明 |
|------------|----------------|------|
| **ol** (OpenLayers) | 依赖 (不打包) | 构建时 external，安装本库时自动安装，运行时由依赖的 `ol` 提供。 |
| **vue**、**lucide-vue-next** | 打包进库 | 构建时打入产物，使用方无需安装。 |

### 2.2 整体结构

使用方项目安装 openlayers + 本库，通过 MapClass 创建 OL Map 并挂载 Vue 应用；Vue 与 OL 共享 container，OL 占满容器，Vue 控件层绝对定位浮于其上。

### 2.3 目录结构

- `src/index.js` 库入口；`MapClass.js` 地图类；`ol/createMap.js` 创建 Map；`vue/` 下 App 与 components。

## 3. 核心 API 设计

- 构造函数：`new MapClass({ container, center, zoom, layers, ... })`
- 实例方法：`getMap()`、`getTimelineCurrentTime()`、`setTimelineToNow()`、`destroy()`
- 与 OpenLayers 的边界：仅使用 OL 公开 API，不修改源码；peer 约定 `ol` 版本。

## 4. 构建与发布

- 入口 `src/index.js`；产物 ESM + UMD；`ol` 外部化，Vue 打包进库；样式单独 CSS。
- 使用方：`npm install CelestiaWeather`，引入 `style.css` 与 `MapClass`。

## 5. 风险与注意事项

- 容器内先 OL target 再 Vue 挂载点；样式用 BEM/CSS 变量；多实例各自独立 Vue App + OL Map。

## 6. 总结

| 项目       | 决策 |
|------------|------|
| 构建工具   | Vite 库模式 |
| 语言       | JavaScript |
| 地图引擎   | ol / OpenLayers（依赖，不打包） |
| 界面       | Vue 3（打包进库） |
| 入口 API   | 单类 MapClass + options |
| 产物       | ESM + UMD + CSS |
