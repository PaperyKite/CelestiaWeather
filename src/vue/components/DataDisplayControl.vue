<template>
  <div class="CelestiaWeather-control-expand CelestiaWeather-datadisplay" :class="{ open }">
    <button
      type="button"
      class="CelestiaWeather-control-expand__trigger"
      @click="toggleOpen"
      :title="currentLabel"
      aria-label="数据显示"
    >
      <BarChart2 :size="iconSize" />
    </button>
    <Transition name="CelestiaWeather-control-expand">
      <div v-if="open" class="CelestiaWeather-control-expand__panel">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          class="CelestiaWeather-control-expand__option"
          :class="{ active: modelValue === opt.value }"
          @click="select(opt.value)"
          :title="opt.label"
          :aria-label="opt.label"
        >
          <component :is="opt.icon" :size="optionIconSize" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { BarChart2, Thermometer, CloudRain, Wind } from 'lucide-vue-next'

const EXPAND_ID = 'datadisplay'
const expandControlOpen = inject('expandControlOpen', { value: null })
const setExpandControlOpen = inject('setExpandControlOpen', () => {})

const props = defineProps({
  modelValue: { type: String, default: 'temperature' },
})

const emit = defineEmits(['update:modelValue'])

const iconSize = 18
const optionIconSize = 18

const options = [
  { value: 'temperature', label: '温度', icon: Thermometer },
  { value: 'precipitation', label: '降水', icon: CloudRain },
  { value: 'wind', label: '风速', icon: Wind },
]

const open = computed(() => expandControlOpen.value === EXPAND_ID)

const currentLabel = computed(() => {
  const opt = options.find((o) => o.value === props.modelValue)
  return opt?.label ?? '数据显示'
})

function toggleOpen() {
  setExpandControlOpen(EXPAND_ID)
}

function select(value) {
  emit('update:modelValue', value)
  setExpandControlOpen(null)
}
</script>

<style scoped>
.CelestiaWeather-datadisplay .CelestiaWeather-control-expand__panel {
  gap: 4px;
}
</style>
