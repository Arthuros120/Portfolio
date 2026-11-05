<script setup lang="ts">
/**
 * A project visual, or a placeholder tile when the file is still missing.
 * A failed load becomes that same tile, never a broken image.
 */
const props = withDefaults(defineProps<{
  src: string | null
  alt: string
  fit?: 'cover' | 'contain'
  eager?: boolean
}>(), {
  fit: 'cover',
  eager: false
})

const failed = ref(false)

watch(() => props.src, () => {
  failed.value = false
})

const visibleSrc = computed(() => (props.src && !failed.value ? props.src : null))

function onError() {
  failed.value = true
}
</script>

<template>
  <span
    class="project-media"
    :class="{ 'project-fit-contain': fit === 'contain' }"
  >
    <img
      v-if="visibleSrc"
      class="project-media-image"
      :alt="alt"
      decoding="async"
      :loading="eager ? 'eager' : 'lazy'"
      :src="visibleSrc"
      @error="onError"
    >
    <span
      v-else
      class="project-media-empty"
    >{{ alt }}</span>
  </span>
</template>
