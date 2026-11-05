<script setup lang="ts">
/**
 * Sailing and the other confirmed interests, from validated YAML.
 * Cards stay static: no interest includes a longer story.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { interests } = usePortfolioContent()

const lead = computed(() => localized(interests.lead, locale.value))
const cards = computed(() => interests.items.map(item => ({
  id: item.id,
  icon: item.icon,
  title: localized(item.title, locale.value),
  detail: localized(item.detail, locale.value),
  club: item.club ? localized(item.club, locale.value) : undefined,
  genres: item.genres ? localized(item.genres, locale.value) : undefined
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
      >
        <InterestCard
          :club="card.club"
          :detail="card.detail"
          :genres="card.genres"
          :icon="card.icon"
          :title="card.title"
        />
      </li>
    </ul>
  </section>
</template>
