import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'TempMap',
      fileName: (format) => `CelestiaWeather.${format}.js`,
    },
    rollupOptions: {
      external: ['ol', 'ol/Map', 'ol/View', 'ol/layer/Tile', 'ol/source/OSM', 'ol/source/XYZ', 'ol/proj'],
      output: {
        globals: {
          ol: 'ol',
          'ol/Map': 'ol.Map',
          'ol/View': 'ol.View',
          'ol/layer/Tile': 'ol.layer.Tile',
          'ol/source/OSM': 'ol.source.OSM',
          'ol/source/XYZ': 'ol.source.XYZ',
          'ol/proj': 'ol.proj',
        },
        assetFileNames: (assetInfo) => {
          return assetInfo.name === 'style.css' ? 'style.css' : assetInfo.name
        },
      },
    },
    cssCodeSplit: true,
    outDir: 'dist',
  },
})
