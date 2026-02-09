<template>
  <div class="CelestiaWeather-timeline">
    <!-- 左侧：日期时间 -->
    <button type="button" class="CelestiaWeather-timeline__datetime" @click="$emit('click-datetime')">
      <Calendar :size="18" class="CelestiaWeather-timeline__datetime-icon" />
      <span>{{ displayDateTime }}</span>
    </button>

    <!-- 中间：播放控制 -->
    <div class="CelestiaWeather-timeline__controls">
      <button type="button" class="CelestiaWeather-timeline__btn" title="后退" @click="$emit('skip-back')" aria-label="后退">
        <SkipBack :size="18" />
      </button>
      <button type="button" class="CelestiaWeather-timeline__btn" :title="playing ? '暂停' : '播放'" @click="togglePlay" aria-label="播放/暂停">
        <Pause v-if="playing" :size="18" />
        <Play v-else :size="18" />
      </button>
      <button type="button" class="CelestiaWeather-timeline__btn" title="前进" @click="$emit('skip-forward')" aria-label="前进">
        <SkipForward :size="18" />
      </button>
      <button type="button" class="CelestiaWeather-timeline__btn" title="循环" @click="$emit('loop')" aria-label="循环" :class="{ active: loop }">
        <Repeat :size="18" />
      </button>
    </div>

    <!-- 右侧：时间滑块 + 实况/预报 -->
    <div class="CelestiaWeather-timeline__right">
      <div class="CelestiaWeather-timeline__slider-wrap">
        <div class="CelestiaWeather-timeline__ticks">
          <span v-for="h in hourTicks" :key="h" class="CelestiaWeather-timeline__tick" :style="tickStyle(h)">{{ h }}时</span>
        </div>
        <div class="CelestiaWeather-timeline__track" ref="trackRef" @click="onTrackClick">
          <div class="CelestiaWeather-timeline__fill" :style="{ width: percent + '%' }" />
          <div
            class="CelestiaWeather-timeline__thumb-wrap"
            :style="{ left: percent + '%' }"
            @mousedown="onThumbDown"
          >
            <div class="CelestiaWeather-timeline__tooltip">{{ displayDateTime }}</div>
            <div class="CelestiaWeather-timeline__thumb">
              {{ displayTime }}
            </div>
          </div>
        </div>
      </div>
      <div class="CelestiaWeather-timeline__tabs">
        <button
          type="button"
          class="CelestiaWeather-timeline__tab"
          :class="{ active: mode === 'realtime' }"
          @click="setMode('realtime')"
        >
          实况
        </button>
        <button
          type="button"
          class="CelestiaWeather-timeline__tab CelestiaWeather-timeline__tab--forecast"
          :class="{ active: mode === 'forecast' }"
          @click="setMode('forecast')"
        >
          预报
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Calendar, Play, Pause, SkipBack, SkipForward, Repeat } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  startHour: { type: Number, default: 7 },
  endHour: { type: Number, default: 11 },
  dateLabel: { type: String, default: '' },
  playing: { type: Boolean, default: false },
  loop: { type: Boolean, default: false },
  mode: { type: String, default: 'realtime' },
  /** 播放时每次增加的量（按 modelValue 数值） */
  playStep: { type: Number, default: 1 },
  /** 播放间隔（毫秒） */
  playInterval: { type: Number, default: 200 },
  /** 挂载时是否同步到当前真实时间 */
  syncToNowOnMount: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'update:mode', 'play', 'pause', 'skip-back', 'skip-forward', 'loop', 'click-datetime', 'time-change'])

const trackRef = ref(null)

const percent = computed(() => {
  const v = props.modelValue
  const min = props.min
  const max = props.max
  if (max <= min) return 0
  return Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))
})

const hourTicks = computed(() => {
  const start = props.startHour
  const end = props.endHour
  const list = []
  for (let h = start; h <= end; h++) list.push(h)
  return list
})

function tickStyle(h) {
  const start = props.startHour
  const end = props.endHour
  const p = end > start ? ((h - start) / (end - start)) * 100 : 0
  return { left: p + '%' }
}

const currentHour = computed(() => {
  const v = props.modelValue
  const min = props.min
  const max = props.max
  const start = props.startHour
  const end = props.endHour
  if (max <= min) return start
  const t = (v - min) / (max - min)
  return start + t * (end - start)
})

const displayTime = computed(() => {
  const h = currentHour.value
  const hi = Math.floor(h)
  const mi = Math.round((h - hi) * 60)
  return `${String(hi).padStart(2, '0')}:${String(mi).padStart(2, '0')}`
})

const displayDateTime = computed(() => {
  const date = props.dateLabel || formatDate(new Date())
  return `${date} ${displayTime.value}`
})

/** 获取当前时间（供外部调用） */
function getCurrentTime() {
  return {
    value: props.modelValue,
    time: displayTime.value,
    dateTime: displayDateTime.value,
    dateLabel: props.dateLabel || formatDate(new Date()),
    currentHour: currentHour.value,
  }
}

/** 同步到当前真实时间（在 startHour~endHour 范围内则按当前时刻设值） */
function setToNow() {
  const now = new Date()
  const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  const start = props.startHour
  const end = props.endHour
  if (h < start || h > end) return
  const t = (h - start) / (end - start)
  const min = props.min
  const max = props.max
  const v = min + t * (max - min)
  emit('update:modelValue', v)
}

let playTimer = null

function startPlayTick() {
  if (playTimer) return
  const min = props.min
  const max = props.max
  const step = props.playStep
  const interval = Math.max(50, props.playInterval)
  playTimer = setInterval(() => {
    const next = props.modelValue + step
    if (next >= max) {
      if (props.loop) {
        emit('update:modelValue', min)
      } else {
        emit('pause')
        emit('update:modelValue', max)
      }
    } else {
      emit('update:modelValue', next)
    }
  }, interval)
}

function stopPlayTick() {
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}

watch(
  () => props.playing,
  (isPlaying) => {
    if (isPlaying) startPlayTick()
    else stopPlayTick()
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (v) => {
    emit('time-change', getCurrentTime())
  }
)

defineExpose({
  getCurrentTime,
  setToNow,
})

onMounted(() => {
  if (props.syncToNowOnMount) setToNow()
})

function formatDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function valueFromPercent(p) {
  const min = props.min
  const max = props.max
  return min + (p / 100) * (max - min)
}

function togglePlay() {
  if (props.playing) emit('pause')
  else emit('play')
}

function setMode(m) {
  emit('update:mode', m)
}

function onTrackClick(e) {
  if (!trackRef.value) return
  const rect = trackRef.value.getBoundingClientRect()
  const p = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
  emit('update:modelValue', valueFromPercent(p))
}

let dragging = false

function onThumbDown(e) {
  e.preventDefault()
  dragging = true
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e) {
  if (!dragging || !trackRef.value) return
  const rect = trackRef.value.getBoundingClientRect()
  const p = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
  emit('update:modelValue', valueFromPercent(p))
}

function onMouseUp() {
  dragging = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

onUnmounted(() => {
  stopPlayTick()
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style scoped>
.CelestiaWeather-timeline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  width: 96%;
  max-width: 56rem;
  padding: 0.5rem 0.75rem;
  background: var(--CelestiaWeather-timeline-bg, #2c3e50);
  border-radius: var(--CelestiaWeather-radius, 4px);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

.CelestiaWeather-timeline__datetime {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.6rem;
  background: var(--CelestiaWeather-timeline-datetime-bg, rgba(255, 255, 255, 0.1));
  border: none;
  border-radius: var(--CelestiaWeather-radius, 4px);
  color: var(--CelestiaWeather-timeline-fg, #fff);
  font-size: var(--CelestiaWeather-font-size, 0.75rem);
  cursor: pointer;
  flex-shrink: 0;
}
.CelestiaWeather-timeline__datetime:hover {
  background: var(--CelestiaWeather-timeline-datetime-hover, rgba(255, 255, 255, 0.15));
}
.CelestiaWeather-timeline__datetime-icon {
  flex-shrink: 0;
  opacity: 0.9;
}

.CelestiaWeather-timeline__controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}
.CelestiaWeather-timeline__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: var(--CelestiaWeather-timeline-btn-bg, rgba(255, 255, 255, 0.12));
  border: none;
  border-radius: 50%;
  color: var(--CelestiaWeather-timeline-fg, #fff);
  cursor: pointer;
  transition: background 0.15s;
}
.CelestiaWeather-timeline__btn:hover {
  background: var(--CelestiaWeather-timeline-btn-hover, rgba(255, 255, 255, 0.2));
}
.CelestiaWeather-timeline__btn.active {
  background: var(--CelestiaWeather-timeline-btn-active, rgba(26, 115, 232, 0.5));
}

.CelestiaWeather-timeline__right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.CelestiaWeather-timeline__slider-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.CelestiaWeather-timeline__ticks {
  position: relative;
  height: 1rem;
  width: 100%;
}
.CelestiaWeather-timeline__tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.65rem;
  color: var(--CelestiaWeather-timeline-fg-muted, rgba(255, 255, 255, 0.7));
}

.CelestiaWeather-timeline__track {
  position: relative;
  width: 100%;
  height: 0.5rem;
  background: var(--CelestiaWeather-timeline-track-bg, rgba(255, 255, 255, 0.2));
  border-radius: 999px;
  cursor: pointer;
  overflow: visible;
}

.CelestiaWeather-timeline__fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--CelestiaWeather-timeline-fill, rgba(26, 115, 232, 0.4));
  border-radius: 999px 0 0 999px;
  pointer-events: none;
  transition: width 0.05s ease-out;
}

.CelestiaWeather-timeline__thumb-wrap {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  cursor: grab;
}
.CelestiaWeather-timeline__thumb-wrap:active {
  cursor: grabbing;
}

.CelestiaWeather-timeline__tooltip {
  position: absolute;
  bottom: 100%;
  margin-bottom: 4px;
  padding: 0.2rem 0.4rem;
  background: var(--CelestiaWeather-timeline-tooltip-bg, #e65100);
  color: #fff;
  font-size: 0.65rem;
  white-space: nowrap;
  border-radius: 2px;
  pointer-events: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.CelestiaWeather-timeline__tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--CelestiaWeather-timeline-tooltip-bg, #e65100);
}

.CelestiaWeather-timeline__thumb {
  padding: 0.2rem 0.4rem;
  background: var(--CelestiaWeather-timeline-thumb-bg, #1a73e8);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 2px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.CelestiaWeather-timeline__tabs {
  display: flex;
  flex-direction: row;
  gap: 0;
  flex-shrink: 0;
  border-radius: var(--CelestiaWeather-radius, 4px);
  overflow: hidden;
}

.CelestiaWeather-timeline__tab {
  padding: 0.35rem 0.6rem;
  background: var(--CelestiaWeather-timeline-tab-realtime-bg, rgba(33, 150, 243, 0.35));
  border: none;
  color: var(--CelestiaWeather-timeline-fg, #fff);
  font-size: 0.7rem;
  cursor: pointer;
  position: relative;
}
.CelestiaWeather-timeline__tab::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: currentColor;
  opacity: 0.8;
}
.CelestiaWeather-timeline__tab.active {
  background: var(--CelestiaWeather-timeline-tab-realtime-active, rgba(33, 150, 243, 0.6));
}
.CelestiaWeather-timeline__tab--forecast {
  background: var(--CelestiaWeather-timeline-tab-forecast-bg, rgba(255, 193, 7, 0.35));
}
.CelestiaWeather-timeline__tab--forecast.active {
  background: var(--CelestiaWeather-timeline-tab-forecast-active, rgba(255, 193, 7, 0.6));
}
</style>
