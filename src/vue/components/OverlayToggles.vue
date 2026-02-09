<template>
  <div class="CelestiaWeather-overlay-toggles">
    <button
      type="button"
      class="CelestiaWeather-overlay-toggles__btn"
      :class="{ active: modelValue.gridData }"
      @click="toggle('gridData')"
      title="格点数据"
      aria-label="格点数据"
    >
      <Grid3X3 :size="iconSize" />
    </button>
    <button
      type="button"
      class="CelestiaWeather-overlay-toggles__btn"
      :class="{ active: modelValue.colorPatch }"
      @click="toggle('colorPatch')"
      title="色斑图"
      aria-label="色斑图"
    >
      <Palette :size="iconSize" />
    </button>
    <button
      type="button"
      class="CelestiaWeather-overlay-toggles__btn"
      :class="{ active: modelValue.stationData }"
      @click="toggle('stationData')"
      title="站点数据"
      aria-label="站点数据"
    >
      <MapPin :size="iconSize" />
    </button>
  </div>
</template>

<script setup>
import { Grid3X3, Palette, MapPin } from 'lucide-vue-next'

const iconSize = 18

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      gridData: false,
      colorPatch: false,
      stationData: false,
    }),
  },
})

const emit = defineEmits(['update:modelValue'])

function toggle(key) {
  const next = { ...props.modelValue, [key]: !props.modelValue[key] }
  emit('update:modelValue', next)
}
</script>

<style scoped>
.CelestiaWeather-overlay-toggles {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  pointer-events: auto;
}

.CelestiaWeather-overlay-toggles__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--CelestiaWeather-control-trigger-size, 2.25rem);
  height: var(--CelestiaWeather-control-trigger-size, 2.25rem);
  padding: 0;
  background: var(--CelestiaWeather-bg, #fff);
  color: var(--CelestiaWeather-color, #202124);
  border: 1px solid var(--CelestiaWeather-border, #dadce0);
  border-radius: var(--CelestiaWeather-radius, 4px);
  cursor: pointer;
  box-shadow: var(--CelestiaWeather-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.CelestiaWeather-overlay-toggles__btn:hover {
  background: var(--CelestiaWeather-bg-hover, #f5f5f5);
}

.CelestiaWeather-overlay-toggles__btn.active {
  background: var(--CelestiaWeather-bg-active, #e8f0fe);
  border-color: var(--CelestiaWeather-accent, #1a73e8);
  color: var(--CelestiaWeather-accent, #1a73e8);
  box-shadow: 0 0 0 1px var(--CelestiaWeather-accent, #1a73e8);
}
</style>
