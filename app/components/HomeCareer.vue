<script setup lang="ts">
import { isQuietExperience } from '~/utils/career'

/**
 * Path section. The boat sits on these steps, never in the hero.
 * One wave moves the boat exactly one step. Other controls do not make a wave.
 */
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const { locale, t } = useI18n()
const { experiences } = usePortfolioContent()
const stepModal = useModalLayer('step')

const waveMs = 900
const reducedMotion = ref(false)
const activeIndex = ref(0)
const waving = ref(false)
const bobbing = ref(false)
const waveKey = ref(0)
let waveTimer = 0

const lead = computed(() => localized(experiences.lead, locale.value))
const steps = computed(() => experiences.steps.map(step => ({
  id: step.id,
  organization: step.organization,
  period: step.period,
  title: localized(step.title, locale.value),
  detail: localized(step.detail, locale.value),
  quiet: isQuietExperience(step.tags)
})))

const active = computed(() => steps.value[activeIndex.value] ?? steps.value[0])
const canRetreat = computed(() => activeIndex.value > 0)
const canAdvance = computed(() => activeIndex.value < steps.value.length - 1)
const stepOpen = computed(() => stepModal.isOpen.value)
const modalStep = computed(() => steps.value.find(step => step.id === stepModal.id.value) ?? null)
const modalTitle = computed(() => {
  if (stepOpen.value && !modalStep.value) {
    return t('career.missing')
  }

  return modalStep.value?.title ?? active.value?.title ?? t('career.missing')
})
const modalDescription = computed(() => {
  if (!modalStep.value) {
    return undefined
  }

  return `${modalStep.value.organization} — ${modalStep.value.period}`
})

watch(() => stepModal.id.value, (id) => {
  if (!id) {
    return
  }

  const index = steps.value.findIndex(step => step.id === id)

  if (index >= 0) {
    activeIndex.value = index
  }
}, { immediate: true })

onMounted(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')

  const sync = () => {
    reducedMotion.value = media.matches

    if (media.matches) {
      calm()
    }
  }

  sync()
  media.addEventListener('change', sync)

  onUnmounted(() => {
    media.removeEventListener('change', sync)
    window.clearTimeout(waveTimer)
  })
})

function calm() {
  waving.value = false
  bobbing.value = false
}

function moveTo(index: number) {
  const count = steps.value.length
  const next = Math.min(count - 1, Math.max(0, index))
  activeIndex.value = next

  const id = steps.value[next]?.id

  if (id && stepModal.isOpen.value && stepModal.id.value !== id) {
    stepModal.open(id)
  }
}

function selectStep(index: number) {
  window.clearTimeout(waveTimer)
  calm()
  moveTo(index)
}

function retreat() {
  if (!canRetreat.value) {
    return
  }

  selectStep(activeIndex.value - 1)
}

function advance() {
  if (!canAdvance.value) {
    return
  }

  selectStep(activeIndex.value + 1)
}

function sendWave() {
  if (!canAdvance.value) {
    return
  }

  const next = activeIndex.value + 1

  if (reducedMotion.value) {
    window.clearTimeout(waveTimer)
    calm()
    moveTo(next)
    return
  }

  window.clearTimeout(waveTimer)
  calm()
  waveKey.value += 1
  moveTo(next)

  void nextTick(() => {
    waving.value = true
    bobbing.value = true
    waveTimer = window.setTimeout(calm, waveMs)
  })
}

function openActive() {
  const id = active.value?.id

  if (id) {
    stepModal.open(id)
  }
}
</script>

<template>
  <section
    id="career"
    ref="root"
    class="section"
    aria-labelledby="career-title"
  >
    <SectionHeading
      :kicker="t('sections.careerKicker')"
      :title="t('nav.career')"
      title-id="career-title"
    />
    <p class="section-lead">
      {{ lead }}
    </p>
    <div
      v-if="active"
      class="career-controls"
    >
      <UButton
        id="career-previous"
        color="neutral"
        :disabled="!canRetreat"
        :label="t('career.previous')"
        variant="outline"
        @click="retreat"
      />
      <UButton
        id="career-wave"
        color="primary"
        :disabled="!canAdvance"
        :label="t('career.sendWave')"
        @click="sendWave"
      />
      <UButton
        id="career-next"
        color="neutral"
        :disabled="!canAdvance"
        :label="t('career.next')"
        variant="outline"
        @click="advance"
      />
    </div>
    <CareerTimeline
      v-if="steps.length"
      :active-index="activeIndex"
      :bobbing="bobbing"
      :can-advance="canAdvance"
      :steps="steps"
      :wave-key="waveKey"
      :waving="waving"
      @select="selectStep"
      @wave="sendWave"
    />
    <p
      v-if="active"
      class="career-live"
      aria-live="polite"
    >
      {{ t('career.active') }}: {{ t('career.step', { title: active.title, organization: active.organization, period: active.period }) }}
    </p>
    <UCard
      v-if="active"
      class="career-summary"
      :class="{ 'career-quiet': active.quiet }"
    >
      <p class="career-period">
        {{ active.period }}
      </p>
      <p class="career-org">
        {{ active.organization }}
      </p>
      <h3 class="career-title">
        {{ active.title }}
      </h3>
      <p class="career-detail career-summary-text">
        {{ active.detail }}
      </p>
      <UButton
        id="career-read"
        :aria-controls="stepOpen ? 'site-modal-step' : undefined"
        :aria-expanded="stepOpen"
        aria-haspopup="dialog"
        color="neutral"
        :label="t('career.read')"
        variant="outline"
        @click="openActive"
      />
    </UCard>
    <ClientOnly>
      <SiteModal
        :description="modalDescription"
        layer="step"
        :title="modalTitle"
      >
        <template #default>
          <div
            v-if="modalStep"
            class="career-modal"
          >
            <p class="career-period">
              {{ modalStep.period }}
            </p>
            <p class="career-org">
              {{ modalStep.organization }}
            </p>
            <p class="career-detail">
              {{ modalStep.detail }}
            </p>
          </div>
          <p
            v-else
            class="career-detail"
          >
            {{ t('career.missing') }}
          </p>
        </template>
      </SiteModal>
    </ClientOnly>
  </section>
</template>
