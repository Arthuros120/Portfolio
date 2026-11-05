<script setup lang="ts">
/**
 * Opening screen: name, role, placeholder introduction, availability and a code card.
 * The wave is decorative only. It does not move when reduced motion is requested.
 */
const { locale, t } = useI18n()
const localePath = useLocalePath()
const { mailto } = useContactMail()
const { statement } = useAvailabilityStatement()
const { availability } = usePortfolioContent()

const projectsHref = computed(() => `${localePath('/')}#projects`)
const now = ref(Date.now())
const contractDate = computed(() => formatContractDate(availability.untilDate, locale.value))
const days = computed(() => daysUntilAvailable(availability.untilDate, availability.timeZone, now.value))

const availabilityStatus = computed(() => {
  if (days.value <= 0) {
    return t('availability.availableNow')
  }

  return t('availability.until', { date: contractDate.value })
})
</script>

<template>
  <section
    id="top"
    class="hero"
    aria-labelledby="hero-title"
  >
    <div class="hero-copy">
      <h1
        id="hero-title"
        class="hero-name"
      >
        {{ t('brand.name') }}
      </h1>
      <p class="hero-role">
        {{ t('hero.role') }}
      </p>
      <div
        class="hero-horizon"
        aria-hidden="true"
      />
      <p class="hero-intro">
        {{ t('hero.intro') }}
      </p>
      <p class="hero-availability">
        <span class="hero-availability-line">{{ availabilityStatus }}</span>
        <span class="hero-availability-line">{{ statement }}</span>
      </p>
      <div class="hero-actions">
        <UButton
          color="primary"
          :label="t('hero.viewProjects')"
          :to="projectsHref"
        />
        <ContactButton :described-by="mailto ? undefined : 'hero-contact-note'" />
      </div>
      <p
        v-if="!mailto"
        id="hero-contact-note"
        class="hero-note"
      >
        {{ t('contact.emailMissing') }}
      </p>
    </div>
    <div class="hero-aside">
      <HeroCodeCard />
    </div>
    <div
      class="hero-wave"
      aria-hidden="true"
    >
      <div class="hero-wave-track">
        <svg
          class="hero-wave-svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path d="M0 40C180 70 360 10 540 40C720 70 900 10 1080 40C1260 70 1440 40 1440 40V80H0Z" />
        </svg>
        <svg
          class="hero-wave-svg"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path d="M0 40C180 70 360 10 540 40C720 70 900 10 1080 40C1260 70 1440 40 1440 40V80H0Z" />
        </svg>
      </div>
    </div>
  </section>
</template>
