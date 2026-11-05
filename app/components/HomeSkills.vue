<script setup lang="ts">
/**
 * Technology logos grouped by category. Names and notes come from YAML.
 * Category headings come from the locale files.
 */
import type { SkillCategory } from '~/types/portfolio'

const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { skills } = usePortfolioContent()

const categoryTitle: Record<SkillCategory, string> = {
  languages: 'skills.categories.languages',
  frameworks: 'skills.categories.frameworks',
  data: 'skills.categories.data'
}

const lead = computed(() => localized(skills.lead, locale.value))
const groups = computed(() => groupSkills(skills.items).map(group => ({
  id: group.category,
  title: t(categoryTitle[group.category]),
  items: group.items.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    blurb: localized(item.blurb, locale.value)
  }))
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
    <div class="skill-groups">
      <div
        v-for="group in groups"
        :key="group.id"
        class="skill-group"
      >
        <h3
          :id="`skills-${group.id}`"
          class="skill-group-title"
        >
          {{ group.title }}
        </h3>
        <ul
          class="skill-logos"
          :aria-labelledby="`skills-${group.id}`"
        >
          <li
            v-for="item in group.items"
            :key="item.id"
          >
            <SkillLogo
              :skill-id="item.id"
              :label="item.label"
              :icon="item.icon"
              :blurb="item.blurb"
            />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
