<script setup>
import DefaultTheme from 'vitepress/theme'
import heroLogo from './hero-logo.svg'

const Layout = DefaultTheme.Layout
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <img :src="heroLogo" alt="CelestiaWeather" class="vp-image hero-logo" />
    </template>
  </Layout>
</template>

<style scoped>
.hero-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: 192px;
  max-height: 192px;
  transform: translate(-50%, -50%);
}
@media (min-width: 640px) {
  .hero-logo {
    max-width: 256px;
    max-height: 256px;
  }
}
@media (min-width: 960px) {
  .hero-logo {
    max-width: 320px;
    max-height: 320px;
  }
}
</style>
