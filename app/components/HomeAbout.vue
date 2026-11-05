<script setup lang="ts">
/**
 * Sailing and the other confirmed interests, from validated YAML.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { interests } = usePortfolioContent()

const lead = computed(() => localized(interests.lead, locale.value))
const cards = computed(() => interests.items.map(item => ({
  id: item.id,
  icon: item.icon,
  wide: item.wide,
  title: localized(item.title, locale.value),
  detail: localized(item.detail, locale.value)
})))
</script>

<template>
  <section
    id="about"
    ref="root"
    class="section"
    aria-labelledby="about-title"
  >
    <SectionHeading
      :kicker="t('sections.aboutKicker')"
      :title="t('nav.about')"
      title-id="about-title"
    />
    <p class="section-lead">
      {{ lead }}
    </p>
    <ul class="about-grid">
      <li
        v-for="card in cards"
        :key="card.id"
        class="about-item"
        :class="{ 'about-card-wide': card.wide }"
      >
        <UCard class="about-card">
          <UIcon
            :name="card.icon"
            class="about-icon"
            aria-hidden="true"
          />
          <h3 class="about-title">
            {{ card.title }}
          </h3>
          <p class="about-detail">
            {{ card.detail }}
          </p>
        </UCard>
      </li>
    </ul>
  </section>
</template>
