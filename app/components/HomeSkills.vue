<script setup lang="ts">
/**
 * Confirmed technologies, grouped, from validated YAML.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { skills } = usePortfolioContent()

const lead = computed(() => localized(skills.lead, locale.value))
const groups = computed(() => skills.groups.map(group => ({
  id: group.id,
  title: localized(group.title, locale.value),
  items: group.items
})))
</script>

<template>
  <section
    id="skills"
    ref="root"
    class="section"
    aria-labelledby="skills-title"
  >
    <SectionHeading
      :kicker="t('sections.skillsKicker')"
      :title="t('nav.skills')"
      title-id="skills-title"
    />
    <p class="section-lead">
      {{ lead }}
    </p>
    <div class="skill-grid">
      <UCard
        v-for="group in groups"
        :key="group.id"
        class="skill-group"
      >
        <h3 class="skill-title">
          {{ group.title }}
        </h3>
        <ul class="skill-list">
          <li
            v-for="item in group.items"
            :key="item"
          >
            <UBadge
              color="neutral"
              variant="subtle"
            >
              {{ item }}
            </UBadge>
          </li>
        </ul>
      </UCard>
    </div>
  </section>
</template>
