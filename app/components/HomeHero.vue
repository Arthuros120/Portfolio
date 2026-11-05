<script setup lang="ts">
/**
 * Opening screen: name, role, placeholder introduction, actions, compass and code card.
 */
const { t } = useI18n()
const localePath = useLocalePath()
const { mailto } = useContactMail()

const projectsHref = computed(() => `${localePath('/')}#projects`)
</script>

<template>
  <section
    id="top"
    class="hero"
    aria-labelledby="hero-title"
  >
    <div class="hero-copy">
      <p class="hero-place">
        {{ t('hero.place') }}
      </p>
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
        {{ t('hero.contactUnavailable') }}
      </p>
    </div>
    <div class="hero-aside">
      <HeroCompass />
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
