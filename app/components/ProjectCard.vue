<script setup lang="ts">
import { resolveHttpsUrl } from '~/utils/public-links'

/**
 * One project card. Layout fixtures stay marked, and the link stays
 * closed until the content file holds a real https URL.
 */
const props = defineProps<{
  title: string
  organization: string
  description: string
  stack: string[]
  placeholder: boolean
  link: string | null
}>()

const { t } = useI18n()
const href = computed(() => resolveHttpsUrl(props.link))
</script>

<template>
  <UCard class="project-card">
    <p
      v-if="placeholder"
      class="project-flag"
    >
      {{ t('projects.flag') }}
    </p>
    <h3 class="project-title">
      {{ title }}
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
    <UButton
      v-if="href"
      class="project-link"
      color="neutral"
      :label="t('projects.view')"
      target="_blank"
      :to="href"
      variant="outline"
    />
    <UButton
      v-else
      class="project-link"
      color="neutral"
      disabled
      :label="t('projects.linkPending')"
      variant="outline"
    />
  </UCard>
</template>
