<script setup lang="ts">
/**
 * Career timeline. Entries stay placeholders until Arthur confirms them.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { t } = useI18n()
const entries = [1, 2, 3]
</script>

<template>
  <section
    id="career"
    ref="root"
    class="section"
    aria-labelledby="career-title"
  >
    <SectionHeading
      :kicker="t('sections.careerKicker')"
      :title="t('nav.career')"
      title-id="career-title"
    />
    <p class="section-lead">
      {{ t('career.lead') }}
    </p>
    <ol class="career-list">
      <li
        v-for="entry in entries"
        :key="entry"
        class="career-item"
      >
        <p class="career-period">
          {{ t('career.period') }}
        </p>
        <h3 class="career-title">
          {{ t('career.title') }}
        </h3>
        <p class="career-detail">
          {{ t('career.detail') }}
        </p>
      </li>
    </ol>
  </section>
</template>
