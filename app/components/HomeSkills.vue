<script setup lang="ts">
/**
 * Confirmed technologies, grouped. No extra tools are listed.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { t } = useI18n()

function items(key: 'skills.languages' | 'skills.frameworks' | 'skills.data') {
  return t(key).split(' · ').map(item => item.trim()).filter(Boolean)
}

const groups = computed(() => [
  { title: t('skills.languagesTitle'), items: items('skills.languages') },
  { title: t('skills.frameworksTitle'), items: items('skills.frameworks') },
  { title: t('skills.dataTitle'), items: items('skills.data') }
])
</script>

<template>
  <section
    id="skills"
    ref="root"
    class="section"
    aria-labelledby="skills-title"
  >
    <SectionHeading
      :kicker="t('sections.skillsKicker')"
      :title="t('nav.skills')"
      title-id="skills-title"
    />
    <p class="section-lead">
      {{ t('skills.lead') }}
    </p>
    <div class="skill-grid">
      <article
        v-for="group in groups"
        :key="group.title"
        class="skill-group"
      >
        <h3 class="skill-title">
          {{ group.title }}
        </h3>
        <ul class="skill-list">
          <li
            v-for="item in group.items"
            :key="item"
          >
            <UBadge
              color="neutral"
              variant="subtle"
            >
              {{ item }}
            </UBadge>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
