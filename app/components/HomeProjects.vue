<script setup lang="ts">
/**
 * Example project cards. Each one is labeled as a placeholder.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { t } = useI18n()

function stack(key: 'projects.taskManager.stack' | 'projects.desktop.stack' | 'projects.dashboard.stack') {
  return t(key).split(' · ').map(item => item.trim()).filter(Boolean)
}

const cards = computed(() => [
  {
    title: t('projects.taskManager.title'),
    description: t('projects.taskManager.description'),
    stack: stack('projects.taskManager.stack')
  },
  {
    title: t('projects.desktop.title'),
    description: t('projects.desktop.description'),
    stack: stack('projects.desktop.stack')
  },
  {
    title: t('projects.dashboard.title'),
    description: t('projects.dashboard.description'),
    stack: stack('projects.dashboard.stack')
  }
])
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
      {{ t('projects.lead') }}
    </p>
    <div class="project-grid">
      <ProjectCard
        v-for="card in cards"
        :key="card.title"
        :description="card.description"
        :stack="card.stack"
        :title="card.title"
      />
    </div>
  </section>
</template>
