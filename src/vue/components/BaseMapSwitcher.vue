<template>
  <div class="CelestiaWeather-control-expand CelestiaWeather-basemap-switcher" :class="{ open }">
    <button
      type="button"
      class="CelestiaWeather-control-expand__trigger"
      @click="toggleOpen"
      :title="currentName"
      aria-label="底图切换"
    >
      <Layers :size="iconSize" />
    </button>
    <Transition name="CelestiaWeather-control-expand">
      <div v-if="open" class="CelestiaWeather-control-expand__panel CelestiaWeather-basemap-switcher__bar">
        <button
          v-for="(item, index) in baseMaps"
          :key="item.id ?? index"
          type="button"
          class="CelestiaWeather-control-expand__option"
          :class="{ active: selectedIndex === index }"
          @click="select(index)"
          :title="item.name ?? item.id ?? `底图 ${index + 1}`"
        >
          <img
            v-if="item.thumbnail"
            :src="item.thumbnail"
            :alt="item.name ?? item.id"
            class="CelestiaWeather-basemap-switcher__thumb"
          />
          <Layers v-else :size="thumbSize" class="CelestiaWeather-basemap-switcher__fallback" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { Layers } from 'lucide-vue-next'

const EXPAND_ID = 'basemap'
const expandControlOpen = inject('expandControlOpen', ref(null))
const setExpandControlOpen = inject('setExpandControlOpen', () => {})

const open = computed(() => expandControlOpen.value === EXPAND_ID)

function toggleOpen() {
  setExpandControlOpen(EXPAND_ID)
}

const iconSize = 18
const thumbSize = 22

const props = defineProps({
  map: { type: Object, required: true },
  baseMaps: {
    type: Array,
    default: () => [],
  },
})

const selectedIndex = ref(0)

const currentName = computed(() => {
  const list = props.baseMaps
  if (!list.length) return '底图'
  const item = list[selectedIndex.value]
  return item?.name ?? item?.id ?? `底图 ${selectedIndex.value + 1}`
})

function setBaseLayerVisible(index) {
  const layers = props.map.getLayers()
  const count = props.baseMaps.length
  for (let i = 0; i < layers.getLength() && i < count; i++) {
    layers.item(i).setVisible(i === index)
  }
}

function select(index) {
  if (index === selectedIndex.value) return
  selectedIndex.value = index
  setBaseLayerVisible(index)
  setExpandControlOpen(null)
}

onMounted(() => {
  setBaseLayerVisible(0)
})
</script>

<style scoped>
.CelestiaWeather-basemap-switcher__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.CelestiaWeather-basemap-switcher__fallback {
  opacity: 0.75;
}
</style>
