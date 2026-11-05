<script setup lang="ts">
/**
 * Project cards loaded from validated YAML.
 * Restricted entries stay free of screenshots and internal figures.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { projects } = usePortfolioContent()

const lead = computed(() => localized(projects.lead, locale.value))
const cards = computed(() => projects.items.map(item => ({
  id: item.id,
  title: localized(item.title, locale.value),
  organization: item.organization,
  description: localized(item.summary, locale.value),
  stack: item.stack,
  placeholder: item.placeholder,
  link: item.link
})))
</script>

<template>
  <section
    id="projects"
    ref="root"
    class="section"
    aria-labelledby="projects-title"
  >
    <SectionHeading
      :kicker="t('sections.projectsKicker')"
      :title="t('nav.projects')"
      title-id="projects-title"
    />
    <p class="section-lead">
      {{ lead }}
    </p>
    <div class="project-grid">
      <ProjectCard
        v-for="card in cards"
        :key="card.id"
        :description="card.description"
        :link="card.link"
        :organization="card.organization"
        :placeholder="card.placeholder"
        :stack="card.stack"
        :title="card.title"
      />
    </div>
  </section>
</template>
