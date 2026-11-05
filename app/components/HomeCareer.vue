<script setup lang="ts">
/**
 * Career steps from validated YAML. Unconfirmed dates and titles stay marked.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { experiences } = usePortfolioContent()

const lead = computed(() => localized(experiences.lead, locale.value))
const steps = computed(() => experiences.steps.map(step => ({
  id: step.id,
  organization: step.organization,
  period: step.period,
  title: localized(step.title, locale.value),
  detail: localized(step.detail, locale.value)
})))
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
      {{ lead }}
    </p>
    <ol class="career-list">
      <li
        v-for="step in steps"
        :key="step.id"
        class="career-item"
      >
        <UCard>
          <p class="career-period">
            {{ step.period }}
          </p>
          <p class="career-org">
            {{ step.organization }}
          </p>
          <h3 class="career-title">
            {{ step.title }}
          </h3>
          <p class="career-detail">
            {{ step.detail }}
          </p>
        </UCard>
      </li>
    </ol>
  </section>
</template>
