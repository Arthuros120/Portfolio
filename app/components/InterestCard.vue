<script setup lang="ts">
/**
 * One interest. The icon is decorative; the title carries the name.
 * Club and genres render only for the professional DJ entry.
 */
defineProps<{
  title: string
  detail: string
  icon: string
  club?: string
  genres?: string
}>()

const { t } = useI18n()
</script>

<template>
  <UCard
    as="article"
    class="about-card"
  >
    <div class="about-card-body">
      <UIcon
        :name="icon"
        class="about-icon"
        aria-hidden="true"
      />
      <div class="about-copy">
        <h3 class="about-title">
          {{ title }}
        </h3>
        <p class="about-detail">
          {{ detail }}
        </p>
        <dl
          v-if="club && genres"
          class="about-meta"
        >
          <div class="about-meta-row">
            <dt>{{ t('about.club') }}</dt>
            <dd>{{ club }}</dd>
          </div>
          <div class="about-meta-row">
            <dt>{{ t('about.genres') }}</dt>
            <dd>{{ genres }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </UCard>
</template>
