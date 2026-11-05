<script setup lang="ts">
import type { ProjectImageView } from '~/utils/projects'
import { resolveHttpsUrl } from '~/utils/public-links'

/**
 * Long description and bento inside the project dialog.
 * The external link stays closed until the YAML holds a real https URL.
 */
const props = defineProps<{
  description: string
  stack: string[]
  link: string | null
  images: ProjectImageView[]
  openImageId: string | null
}>()

const emit = defineEmits<{
  openImage: [id: string]
}>()

const { t } = useI18n()
const href = computed(() => resolveHttpsUrl(props.link))
</script>

<template>
  <div class="project-detail">
    <p class="project-description">
      {{ description }}
    </p>
    <ul
      v-if="stack.length"
      class="project-stack"
    >
      <li
        v-for="tech in stack"
        :key="tech"
      >
        <UBadge
          color="neutral"
          variant="subtle"
        >
          {{ tech }}
        </UBadge>
      </li>
    </ul>
    <UButton
      v-if="href"
      class="project-link"
      color="neutral"
      :label="t('projects.view')"
      rel="noopener noreferrer"
      target="_blank"
      :to="href"
      variant="outline"
    />
    <ProjectBento
      :empty-label="t('projects.mediaEmpty')"
      :images="images"
      :label="t('projects.visuals')"
      :open-id="openImageId"
      @open="emit('openImage', $event)"
    />
  </div>
</template>
