<script setup lang="ts">
/**
 * One example project. The flag marks it as a placeholder, not client work.
 */
defineProps<{
  title: string
  description: string
  stack: string[]
}>()

const { t } = useI18n()
</script>

<template>
  <UCard class="project-card">
    <p class="project-flag">
      {{ t('projects.flag') }}
    </p>
    <h3 class="project-title">
      {{ title }}
    </h3>
    <p class="project-description">
      {{ description }}
    </p>
    <ul class="project-stack">
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
      class="project-link"
      color="neutral"
      disabled
      :label="t('projects.linkPending')"
      variant="outline"
    />
  </UCard>
</template>
