<script setup lang="ts">
import { toProjectImageView } from '~/utils/projects'

/**
 * Project cards on the single page.
 * A card opens the detail dialog. An image opens the lightbox above it.
 * Restricted projects stay in the grid, with public-safe media only.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { projects } = usePortfolioContent()
const projectModal = useModalLayer('project')
const imageModal = useModalLayer('image')

const lead = computed(() => localized(projects.lead, locale.value))

const cards = computed(() => projects.items.map((item) => {
  const thumb = item.images[0]
  const view = thumb ? toProjectImageView(thumb, locale.value) : null

  return {
    id: item.id,
    title: localized(item.title, locale.value),
    organization: item.organization,
    description: localized(item.summary, locale.value),
    stack: item.stack,
    placeholder: item.placeholder,
    thumbSrc: view?.src ?? null,
    thumbAlt: view?.alt ?? t('projects.mediaEmpty')
  }
}))

const activeProject = computed(() => (
  projects.items.find(item => item.id === projectModal.id.value) ?? null
))

const activeImages = computed(() => (
  activeProject.value
    ? activeProject.value.images.map(image => toProjectImageView(image, locale.value))
    : []
))

const projectTitle = computed(() => {
  if (!activeProject.value) {
    return t('projects.missing')
  }

  return localized(activeProject.value.title, locale.value)
})

const projectSubtitle = computed(() => activeProject.value?.organization)

const projectDescription = computed(() => {
  if (!activeProject.value) {
    return ''
  }

  return localized(activeProject.value.description, locale.value)
})

const lightboxImage = computed(() => {
  const id = imageModal.id.value

  if (!id) {
    return null
  }

  const source = activeProject.value
    ? activeProject.value.images
    : projects.items.flatMap(item => item.images)
  const image = source.find(item => item.id === id)

  return image ? toProjectImageView(image, locale.value) : null
})

const imageTitle = computed(() => lightboxImage.value?.alt ?? t('projects.imageMissing'))

function openProject(id: string) {
  projectModal.open(id)
}

function openImage(id: string) {
  imageModal.open(id)
}
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
        :project-id="card.id"
        :description="card.description"
        :expanded="projectModal.isOpen.value && projectModal.id.value === card.id"
        :organization="card.organization"
        :placeholder="card.placeholder"
        :stack="card.stack"
        :thumb-alt="card.thumbAlt"
        :thumb-src="card.thumbSrc"
        :title="card.title"
        @open="openProject(card.id)"
      />
    </div>
    <ClientOnly>
      <SiteModal
        :description="projectSubtitle"
        layer="project"
        :title="projectTitle"
      >
        <ProjectDetail
          v-if="activeProject"
          :description="projectDescription"
          :images="activeImages"
          :link="activeProject.link"
          :open-image-id="imageModal.id.value"
          :stack="activeProject.stack"
          @open-image="openImage"
        />
        <p
          v-else
          class="project-description"
        >
          {{ t('projects.missing') }}
        </p>
      </SiteModal>
      <SiteModal
        fullscreen
        layer="image"
        :title="imageTitle"
      >
        <div class="project-lightbox">
          <ProjectMediaTile
            v-if="lightboxImage"
            :alt="lightboxImage.alt"
            eager
            fit="contain"
            :src="lightboxImage.src"
          />
          <p
            v-else
            class="project-description"
          >
            {{ t('projects.imageMissing') }}
          </p>
        </div>
      </SiteModal>
    </ClientOnly>
  </section>
</template>
