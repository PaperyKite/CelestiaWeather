import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 抑制 VitePress 默认主题 useWindowScroll 导致的 hydration mismatch 控制台报错
    if (typeof window !== 'undefined') {
      const orig = console.warn
      console.warn = (...args) => {
        if (args[0] && String(args[0]).includes('Hydration')) return
        orig.apply(console, args)
      }
    }
  },
}
