<script setup lang="ts">
/**
 * Sailing and the other confirmed interests. Details Arthur has not given stay marked.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { t } = useI18n()

const interests = computed(() => [
  { icon: 'i-lucide-sailboat', title: t('about.sailingTitle'), detail: t('about.sailingDetail'), wide: true },
  { icon: 'i-lucide-swords', title: t('about.martialArtsTitle'), detail: t('about.martialArtsDetail'), wide: false },
  { icon: 'i-lucide-mountain', title: t('about.climbingTitle'), detail: t('about.climbingDetail'), wide: false },
  { icon: 'i-lucide-gamepad-2', title: t('about.gamesTitle'), detail: t('about.gamesDetail'), wide: false },
  { icon: 'i-lucide-music', title: t('about.djTitle'), detail: t('about.djDetail'), wide: false }
])
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
      {{ t('about.lead') }}
    </p>
    <ul class="about-grid">
      <li
        v-for="interest in interests"
        :key="interest.title"
        class="about-card"
        :class="{ 'about-card-wide': interest.wide }"
      >
        <UIcon
          :name="interest.icon"
          class="about-icon"
          aria-hidden="true"
        />
        <h3 class="about-title">
          {{ interest.title }}
        </h3>
        <p class="about-detail">
          {{ interest.detail }}
        </p>
      </li>
    </ul>
  </section>
</template>
