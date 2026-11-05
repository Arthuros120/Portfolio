<script setup lang="ts">
/**
 * Page title for routes that do not have their section content yet.
 */
const props = defineProps<{
  message: 'nav.home' | 'nav.projects' | 'nav.about' | 'nav.contact'
}>()

const { t } = useI18n()

useHead(() => ({
  title: t(props.message)
}))
</script>

<template>
  <h1 class="page-title">
    {{ t(message) }}
  </h1>
</template>
