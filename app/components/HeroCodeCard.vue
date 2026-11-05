<script setup lang="ts">
/**
 * IDE-style profile snippet. Name and role use the same locale keys as the hero.
 * The comment stays a placeholder. The chrome stays dark in both themes.
 */
const { t } = useI18n()
</script>

<template>
  <figure class="code-card">
    <figcaption class="code-card-chrome">
      <span
        class="code-card-dots"
        aria-hidden="true"
      >
        <span class="code-card-dot code-card-dot-close" />
        <span class="code-card-dot code-card-dot-min" />
        <span class="code-card-dot code-card-dot-max" />
      </span>
      <span class="code-card-name">{{ t('hero.codeFile') }}</span>
    </figcaption>
    <pre class="code-card-pre"><code>
      <span class="code-card-line">
        <span
          class="code-card-gutter"
          aria-hidden="true"
        >1</span>
        <span class="code-card-source">
          <span class="code-card-comment">{{ t('hero.codeComment') }}</span>
        </span>
      </span>
      <span class="code-card-line">
        <span
          class="code-card-gutter"
          aria-hidden="true"
        >2</span>
        <span class="code-card-source">
          <span class="code-card-keyword">const</span> profile = {
        </span>
      </span>
      <span class="code-card-line code-card-line-in">
        <span
          class="code-card-gutter"
          aria-hidden="true"
        >3</span>
        <span class="code-card-source">
          <span class="code-card-prop">name</span>: <span class="code-card-string">"{{ t('brand.name') }}"</span>,
        </span>
      </span>
      <span class="code-card-line code-card-line-in">
        <span
          class="code-card-gutter"
          aria-hidden="true"
        >4</span>
        <span class="code-card-source">
          <span class="code-card-prop">role</span>: <span class="code-card-string">"{{ t('hero.role') }}"</span>
        </span>
      </span>
      <span class="code-card-line">
        <span
          class="code-card-gutter"
          aria-hidden="true"
        >5</span>
        <span class="code-card-source">}</span>
      </span>
    </code></pre>
  </figure>
</template>
