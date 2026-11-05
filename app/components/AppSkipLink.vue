<script setup lang="ts">
/**
 * First focusable control. Sends keyboard users to the main content.
 */
const { t } = useI18n()
</script>

<template>
  <a
    class="skip-link"
    href="#main-content"
  >
    {{ t('a11y.skipToContent') }}
  </a>
</template>
