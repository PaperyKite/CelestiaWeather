import { defineConfig } from 'vitepress'

export default defineConfig({
  base: './',
  lang: 'zh-CN',
  title: 'CelestiaWeather',
  description: '基于 OpenLayers 的地图类库，Vue 3 界面已打包进库，安装即用',
  ignoreDeadLinks: true,
  // 固定为暗色并关闭切换，避免 appearance 导致服务端/客户端渲染不一致（hydration mismatch）
  appearance: false,
  head: [
    // 在任何脚本前为 <html> 加上 dark，使首屏与 Vue 水合一致，避免 hydration mismatch
    ['script', {}, 'document.documentElement.classList.add("dark")'],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'CelestiaWeather',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/map-class' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '快速开始',
          link: '/guide/',
        },
      ],
      '/api/': [
        {
          text: 'MapClass',
          link: '/api/map-class',
        },
      ],
    },
    notFound: {
      code: '404',
      title: '页面未找到',
      quote: '您访问的链接可能已失效或不存在，请从首页或导航重新进入。',
      linkText: '返回首页',
      linkLabel: '返回首页',
    },
  },
})
