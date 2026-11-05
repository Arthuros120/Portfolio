<script setup lang="ts">
/**
 * Kicker and title shared by the home-page sections.
 */
defineProps<{
  kicker: string
  title: string
  titleId: string
}>()
</script>

<template>
  <p class="section-kicker">
    {{ kicker }}
  </p>
  <h2
    :id="titleId"
    class="section-title"
  >
    {{ title }}
  </h2>
</template>
