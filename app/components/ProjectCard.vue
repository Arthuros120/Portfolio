<script setup lang="ts">
/**
 * One project card. The whole surface opens the detail dialog.
 * The thumbnail is a placeholder tile until a public file is provided.
 */
defineProps<{
  projectId: string
  title: string
  organization: string
  description: string
  stack: string[]
  placeholder: boolean
  expanded: boolean
  thumbSrc: string | null
  thumbAlt: string
}>()

const emit = defineEmits<{
  open: []
}>()

const { t } = useI18n()
</script>

<template>
  <UCard
    as="article"
    class="project-card"
  >
    <div class="project-thumb">
      <ProjectMediaTile
        :alt="thumbAlt"
        :src="thumbSrc"
      />
    </div>
    <div class="project-card-copy">
      <p
        v-if="placeholder"
        class="project-flag"
      >
        {{ t('projects.flag') }}
      </p>
      <h3 class="project-title">
        <button
          :id="`project-${projectId}`"
          type="button"
          class="project-card-open"
          :aria-controls="expanded ? 'site-modal-project' : undefined"
          :aria-expanded="expanded"
          :aria-label="`${title}. ${t('projects.open')}`"
          aria-haspopup="dialog"
          @click="emit('open')"
        >
          {{ title }}
        </button>
      </h3>
      <p
        v-if="organization"
        class="project-org"
      >
        {{ organization }}
      </p>
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
      <p
        class="project-open-label"
        aria-hidden="true"
      >
        {{ t('projects.open') }}
      </p>
    </div>
  </UCard>
</template>
