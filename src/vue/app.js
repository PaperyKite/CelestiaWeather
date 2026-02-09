import { createApp } from 'vue'
import App from './App.vue'
import '../styles/theme.css'

/**
 * 挂载 Vue 3 应用到指定容器，用于地图控件等 UI
 * Vue 会打包进库，不依赖使用方安装 Vue
 * @param {HTMLElement} container
 * @param {object} props - 传给根组件的 props（map, baseMaps, theme, setTheme, showStatus, showBaseMapSwitcher, showStyleControl）
 * @returns {import('vue').App}
 */
export function mountVueApp(container, props = {}) {
  const app = createApp(App, props)
  app.mount(container)
  return app
}
