<script setup lang="ts">
import { resolveHttpsUrl } from '~/utils/public-links'

/**
 * Contact section. The control stays disabled until a public email exists.
 * LinkedIn posts stay text until the profile file holds real URLs.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { t } = useI18n()
const { mailto } = useContactMail()
const { profile } = usePortfolioContent()

const posts = computed(() => profile.linkedinPosts
  .map(url => resolveHttpsUrl(url))
  .filter((url): url is string => url !== null))
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
    <ul
      v-if="posts.length"
      class="contact-posts"
    >
      <li
        v-for="url in posts"
        :key="url"
      >
        <UButton
          color="neutral"
          :label="t('contact.postLink')"
          target="_blank"
          :to="url"
          variant="outline"
        />
      </li>
    </ul>
    <p
      v-else
      class="section-lead"
    >
      {{ t('contact.postsPending') }}
    </p>
    <div class="contact-actions">
      <ContactButton :described-by="mailto ? undefined : 'contact-email-note'" />
    </div>
    <p
      v-if="!mailto"
      id="contact-email-note"
      class="hero-note"
    >
      {{ t('hero.contactUnavailable') }}
    </p>
  </section>
</template>
