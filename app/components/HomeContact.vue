<script setup lang="ts">
/**
 * Contact section: openness, countdown, profiles, and a mailto control.
 * The control stays disabled until a public email exists.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { t } = useI18n()
const { mailto } = useContactMail()
</script>

<template>
  <section
    id="contact"
    ref="root"
    class="section"
    aria-labelledby="contact-title"
  >
    <SectionHeading
      :kicker="t('sections.contactKicker')"
      :title="t('nav.contact')"
      title-id="contact-title"
    />
    <AvailabilityCountdown />
    <div class="contact-actions">
      <ContactButton :described-by="mailto ? undefined : 'contact-email-note'" />
    </div>
    <p
      v-if="!mailto"
      id="contact-email-note"
      class="contact-note"
    >
      {{ t('contact.emailMissing') }}
    </p>
    <nav
      class="contact-profiles"
      :aria-label="t('contact.profiles')"
    >
      <SocialLinks />
    </nav>
  </section>
</template>
