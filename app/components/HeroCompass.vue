<script setup lang="ts">
/**
 * Decorative compass. The needle tracks scroll progress, and stays still
 * when the visitor prefers reduced motion.
 */
const angle = ref(0)

onMounted(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')

  const update = () => {
    if (media.matches) {
      angle.value = 0
      return
    }

    const max = document.documentElement.scrollHeight - window.innerHeight
    const progress = max > 0 ? window.scrollY / max : 0
    angle.value = -12 + progress * 36
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
  media.addEventListener('change', update)

  onUnmounted(() => {
    window.removeEventListener('scroll', update)
    media.removeEventListener('change', update)
  })
})
</script>

<template>
  <div
    class="compass"
    :style="{ '--compass-angle': `${angle}deg` }"
    aria-hidden="true"
  >
    <span class="compass-ring">
      <span class="compass-n">N</span>
      <span class="compass-e">E</span>
      <span class="compass-s">S</span>
      <span class="compass-w">W</span>
      <span class="compass-needle" />
      <span class="compass-cap" />
    </span>
  </div>
</template>
