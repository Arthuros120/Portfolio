<script setup lang="ts">
/**
 * Small profile snippet beside the hero. Facts only; the comment stays a placeholder.
 */
const { t } = useI18n()
</script>

<template>
  <figure class="code-card">
    <figcaption class="code-card-file">
      <span
        class="code-card-dot"
        aria-hidden="true"
      />
      <span
        class="code-card-dot"
        aria-hidden="true"
      />
      <span
        class="code-card-dot"
        aria-hidden="true"
      />
      <span class="code-card-name">{{ t('hero.codeFile') }}</span>
    </figcaption>
    <pre class="code-card-pre"><code>{{ t('hero.code') }}</code></pre>
  </figure>
</template>
