<template>
  <div class="CelestiaWeather-status">
    <span class="CelestiaWeather-status__zoom">层级 {{ currentZoom }}</span>
    <span class="CelestiaWeather-status__coord">{{ coordText }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { toLonLat } from 'ol/proj'

const props = defineProps({
  map: { type: Object, required: true },
})

const currentZoom = ref(0)
const coordText = ref('经度 -- 纬度 --')

function updateZoom() {
  if (props.map?.getView()) {
    currentZoom.value = Math.round(props.map.getView().getZoom())
  }
}

function updateCoord(evt) {
  if (!props.map) return
  const pixel = props.map.getEventPixel(evt)
  const coord = props.map.getCoordinateFromPixel(pixel)
  if (coord) {
    const lonLat = toLonLat(coord)
    coordText.value = `经度 ${lonLat[0].toFixed(4)} 纬度 ${lonLat[1].toFixed(4)}`
  } else {
    coordText.value = '经度 -- 纬度 --'
  }
}

function clearCoord() {
  coordText.value = '经度 -- 纬度 --'
}

let resolutionKey = null

onMounted(() => {
  updateZoom()
  const mapEl = props.map.getTargetElement?.()
  if (mapEl) {
    mapEl.addEventListener('pointermove', updateCoord)
    mapEl.addEventListener('pointerleave', clearCoord)
  }
  if (props.map?.getView()) {
    resolutionKey = props.map.getView().on('change:resolution', updateZoom)
  }
})

onUnmounted(() => {
  const mapEl = props.map?.getTargetElement?.()
  if (mapEl) {
    mapEl.removeEventListener('pointermove', updateCoord)
    mapEl.removeEventListener('pointerleave', clearCoord)
  }
  if (resolutionKey && props.map?.getView()) {
    props.map.getView().unByKey(resolutionKey)
  }
})
</script>

<style scoped>
.CelestiaWeather-status {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.35rem 0.6rem;
  background: var(--CelestiaWeather-status-bg, rgba(255, 255, 255, 0.92));
  color: var(--CelestiaWeather-color, #202124);
  border: 1px solid var(--CelestiaWeather-border, #dadce0);
  border-radius: var(--CelestiaWeather-radius, 4px);
  font-size: var(--CelestiaWeather-font-size, 0.75rem);
  box-shadow: var(--CelestiaWeather-shadow, 0 1px 4px rgba(0, 0, 0, 0.12));
  pointer-events: auto;
}
.CelestiaWeather-status__zoom {
  font-weight: 500;
}
.CelestiaWeather-status__coord {
  color: var(--CelestiaWeather-color-muted, #5f6368);
}
</style>
