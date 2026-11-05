<script setup lang="ts">
import { contactEmail, resolvePublicEmail } from '~/utils/public-links'

/**
 * Home hero: name, role, a placeholder introduction, and two calls to action.
 * Contact stays disabled until content holds a real public email address.
 */
const { t } = useI18n()
const localePath = useLocalePath()

const mailto = computed(() => {
  const email = resolvePublicEmail(contactEmail)

  if (!email) {
    return null
  }

  const subject = encodeURIComponent(t('hero.mailSubject'))
  const body = encodeURIComponent(t('hero.mailBody'))

  return `mailto:${email}?subject=${subject}&body=${body}`
})

useHead(() => ({
  title: `${t('brand.name')} — ${t('hero.role')}`
}))
</script>

<template>
  <section
    aria-labelledby="hero-title"
    class="hero"
  >
    <div
      aria-hidden="true"
      class="hero-horizon"
    />
    <h1
      id="hero-title"
      class="hero-name"
    >
      {{ t('brand.name') }}
    </h1>
    <p class="hero-role">
      {{ t('hero.role') }}
    </p>
    <p class="hero-intro">
      {{ t('hero.intro') }}
    </p>
    <div class="hero-actions">
      <UButton
        color="primary"
        :label="t('hero.viewProjects')"
        :to="localePath('/projects')"
      />
      <UButton
        v-if="mailto"
        color="neutral"
        :label="t('hero.contact')"
        :to="mailto"
        variant="outline"
      />
      <UButton
        v-else
        aria-describedby="hero-contact-note"
        color="neutral"
        disabled
        :label="t('hero.contact')"
        variant="outline"
      />
    </div>
    <p
      v-if="!mailto"
      id="hero-contact-note"
      class="hero-note"
    >
      {{ t('hero.contactUnavailable') }}
    </p>
  </section>
</template>
