<script setup lang="ts">
/**
 * Contact control. Stays disabled until content holds a real public email.
 */
defineProps<{
  describedBy?: string
}>()

const { t } = useI18n()
const { mailto } = useContactMail()
</script>

<template>
  <UButton
    v-if="mailto"
    color="neutral"
    :label="t('hero.contact')"
    :to="mailto"
    variant="outline"
  />
  <UButton
    v-else
    :aria-describedby="describedBy"
    color="neutral"
    disabled
    :label="t('hero.contact')"
    variant="outline"
  />
</template>
