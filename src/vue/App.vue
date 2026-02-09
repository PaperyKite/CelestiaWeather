<template>
  <div class="CelestiaWeather-ui-root">
    <!-- 右侧：所有控制类插件自上而下排列，同时只展开一个 -->
    <div ref="controlsRightRef" class="CelestiaWeather-controls-right">
      <BaseMapSwitcher
        v-if="showBaseMapSwitcher && baseMaps && baseMaps.length > 1"
        :map="map"
        :base-maps="baseMaps"
      />
      <StyleControl
        v-if="showStyleControl"
        :theme="theme"
        :set-theme="setTheme"
      />
      <DataDisplayControl
        v-if="showDataDisplay"
        :model-value="dataDisplayType"
        @update:model-value="setDataDisplayType"
      />
      <OverlayToggles
        v-if="showOverlayToggles"
        v-model="overlayToggles"
      />
    </div>
    <!-- 左下角：状态信息（层级 + 经纬度） -->
    <MapStatus
      v-if="showStatus"
      :map="map"
    />
    <!-- 下方居中：时间轴（日期时间 + 播放控制 + 滑块 + 实况/预报） -->
    <Timeline
      v-if="showTimeline"
      ref="timelineRef"
      v-model="timelineValue"
      :min="timelineMin"
      :max="timelineMax"
      :date-label="timelineDateLabel"
      :start-hour="timelineStartHour"
      :end-hour="timelineEndHour"
      :playing="timelinePlaying"
      :loop="timelineLoop"
      :mode="timelineMode"
      :play-step="timelinePlayStep"
      :play-interval="timelinePlayInterval"
      :sync-to-now-on-mount="timelineSyncToNowOnMount"
      @update:mode="setTimelineMode"
      @play="timelinePlaying = true"
      @pause="timelinePlaying = false"
      @loop="timelineLoop = !timelineLoop"
      @time-change="onTimelineTimeChange"
    />
  </div>
</template>

<script setup>
import { ref, provide, nextTick, onMounted, onUnmounted } from 'vue'
import BaseMapSwitcher from './components/BaseMapSwitcher.vue'
import StyleControl from './components/StyleControl.vue'
import DataDisplayControl from './components/DataDisplayControl.vue'
import OverlayToggles from './components/OverlayToggles.vue'
import MapStatus from './components/MapStatus.vue'
import Timeline from './components/Timeline.vue'

const props = defineProps({
  map: { type: Object, required: true },
  baseMaps: { type: Array, default: () => [] },
  theme: { type: String, default: 'light' },
  setTheme: { type: Function, default: () => {} },
  showStatus: { type: Boolean, default: true },
  showBaseMapSwitcher: { type: Boolean, default: true },
  showStyleControl: { type: Boolean, default: true },
  showDataDisplay: { type: Boolean, default: true },
  dataDisplayType: { type: String, default: 'temperature' },
  showOverlayToggles: { type: Boolean, default: true },
  overlayToggles: { type: Object, default: () => ({ gridData: false, colorPatch: false, stationData: false }) },
  showTimeline: { type: Boolean, default: true },
  timelineMin: { type: Number, default: 0 },
  timelineMax: { type: Number, default: 100 },
  timelineDateLabel: { type: String, default: '' },
  timelineStartHour: { type: Number, default: 7 },
  timelineEndHour: { type: Number, default: 11 },
  timelinePlayStep: { type: Number, default: 1 },
  timelinePlayInterval: { type: Number, default: 200 },
  timelineSyncToNowOnMount: { type: Boolean, default: false },
  onTimelineReady: { type: Function, default: null },
  onTimelineTimeChange: { type: Function, default: null },
})

const dataDisplayType = ref(props.dataDisplayType)
const overlayToggles = ref({ ...props.overlayToggles })
const timelineRef = ref(null)
const timelineValue = ref(props.timelineMin)
const timelinePlaying = ref(false)
const timelineLoop = ref(false)
const timelineMode = ref('realtime')

function setTimelineMode(v) {
  timelineMode.value = v
}

function setDataDisplayType(v) {
  dataDisplayType.value = v
}

function onTimelineTimeChange(payload) {
  props.onTimelineTimeChange?.(payload)
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await nextTick()
  props.onTimelineReady?.(timelineRef.value)
})

const expandControlOpen = ref(null)
const controlsRightRef = ref(null)

provide('expandControlOpen', expandControlOpen)
provide('setExpandControlOpen', (id) => {
  expandControlOpen.value = expandControlOpen.value === id ? null : id
})

function handleClickOutside(e) {
  if (!controlsRightRef.value?.contains(e.target)) {
    expandControlOpen.value = null
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.CelestiaWeather-ui-root {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.CelestiaWeather-ui-root > * {
  pointer-events: auto;
}

.CelestiaWeather-controls-right {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  pointer-events: auto;
}
</style>
