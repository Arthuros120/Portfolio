<script setup lang="ts">
/**
 * Contact control. Stays visible and disabled until content holds a real public email.
 * The accessible name then says the address is missing.
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
    :aria-label="t('hero.contactMissing')"
    color="neutral"
    disabled
    :label="t('hero.contact')"
    type="button"
    variant="outline"
  />
</template>
