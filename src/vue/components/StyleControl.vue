<template>
  <div class="CelestiaWeather-control-expand CelestiaWeather-style-control" :class="{ open }">
    <button
      type="button"
      class="CelestiaWeather-control-expand__trigger"
      @click="toggleOpen"
      :title="currentThemeLabel"
      aria-label="主题切换"
    >
      <Palette :size="iconSize" />
    </button>
    <Transition name="CelestiaWeather-control-expand">
      <div v-if="open" class="CelestiaWeather-control-expand__panel CelestiaWeather-style-control__panel">
        <button
          v-for="t in themes"
          :key="t.value"
          type="button"
          class="CelestiaWeather-control-expand__option"
          :class="{ active: currentTheme === t.value }"
          @click="selectTheme(t.value)"
          :title="t.label"
          :aria-label="t.label"
        >
          <component :is="t.icon" :size="optionIconSize" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { Palette, Sun, Moon } from 'lucide-vue-next'

const EXPAND_ID = 'style'
const expandControlOpen = inject('expandControlOpen', ref(null))
const setExpandControlOpen = inject('setExpandControlOpen', () => {})

const open = computed(() => expandControlOpen.value === EXPAND_ID)

function toggleOpen() {
  setExpandControlOpen(EXPAND_ID)
}

const iconSize = 18
const optionIconSize = 18

const props = defineProps({
  theme: { type: String, default: 'light' },
  setTheme: { type: Function, default: () => {} },
})

const themes = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
]

const currentTheme = ref(props.theme)

const currentThemeLabel = computed(() => {
  const t = themes.find((x) => x.value === currentTheme.value)
  return t?.label ?? '主题'
})

function selectTheme(value) {
  currentTheme.value = value
  props.setTheme(value)
  setExpandControlOpen(null)
}

onMounted(() => {
  currentTheme.value = props.theme
})
</script>
