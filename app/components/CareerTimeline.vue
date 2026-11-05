<script setup lang="ts">
import { stepAnchor } from '~/utils/career'

/**
 * Calm water, one boat, and the path steps.
 * A tap on the water asks the parent to send a single wave.
 * Step buttons and arrow keys only change the selected step.
 */
export type CareerTimelineStep = {
  id: string
  title: string
  organization: string
  period: string
  quiet: boolean
}

const props = defineProps<{
  steps: CareerTimelineStep[]
  activeIndex: number
  waving: boolean
  bobbing: boolean
  waveKey: number
  canAdvance: boolean
}>()

const emit = defineEmits<{
  select: [index: number]
  wave: []
}>()

const { t } = useI18n()
const sea = ref<HTMLElement | null>(null)
const stepsRoot = ref<HTMLElement | null>(null)

const boatAnchor = computed(() => stepAnchor(props.activeIndex, props.steps.length))
const trackStyle = computed(() => ({
  '--career-count': String(props.steps.length),
  '--career-x': `${boatAnchor.value}%`
}))

function onWaterClick() {
  if (!props.canAdvance) {
    return
  }

  emit('wave')
}

function move(index: number) {
  if (index < 0 || index >= props.steps.length || index === props.activeIndex) {
    return
  }

  emit('select', index)

  nextTick(() => {
    focusStep(index)
  })
}

function focusStep(index: number) {
  const button = stepsRoot.value?.querySelectorAll<HTMLButtonElement>('.career-step')[index]
  button?.focus()
}

function onStepsKeydown(event: KeyboardEvent) {
  const count = props.steps.length

  if (count === 0) {
    return
  }

  let next = props.activeIndex

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = Math.min(count - 1, props.activeIndex + 1)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = Math.max(0, props.activeIndex - 1)
  } else if (event.key === 'Home') {
    next = 0
  } else if (event.key === 'End') {
    next = count - 1
  } else {
    return
  }

  event.preventDefault()
  move(next)
}

function revealActive() {
  const scroller = sea.value
  const current = scroller?.querySelector<HTMLElement>('.career-current')

  if (!scroller || !current) {
    return
  }

  const seaRect = scroller.getBoundingClientRect()
  const stepRect = current.getBoundingClientRect()
  const delta = stepRect.left - seaRect.left - (seaRect.width - stepRect.width) / 2
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  scroller.scrollTo({
    left: scroller.scrollLeft + delta,
    behavior: reduce ? 'auto' : 'smooth'
  })
}

watch(() => props.activeIndex, () => {
  if (!import.meta.client) {
    return
  }

  nextTick(() => {
    revealActive()
  })
})
</script>

<template>
  <div
    ref="sea"
    class="career-sea"
  >
    <div
      class="career-track"
      :style="trackStyle"
    >
      <div
        class="career-wind"
        aria-hidden="true"
      >
        <span class="career-wind-dot" />
        <span class="career-wind-dot" />
        <span class="career-wind-dot" />
      </div>
      <button
        id="career-water"
        type="button"
        class="career-water"
        :disabled="!canAdvance"
        :aria-label="t('career.water')"
        @click="onWaterClick"
      >
        <svg
          v-if="waving"
          :key="waveKey"
          class="career-wave"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M0 32 C80 32 80 10 160 10 C240 10 240 32 320 32 C400 32 400 12 480 12 C560 12 560 32 640 32 C720 32 720 10 800 10 C880 10 880 32 960 32 C1040 32 1040 12 1120 12 C1200 12 1200 32 1280 32 C1360 32 1360 14 1440 14"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <div
        class="career-boat"
        :class="{ 'career-bobbing': bobbing }"
        aria-hidden="true"
      >
        <CareerBoat />
      </div>
      <div
        ref="stepsRoot"
        class="career-steps"
        role="radiogroup"
        aria-orientation="horizontal"
        :aria-label="t('career.timeline')"
        @keydown="onStepsKeydown"
      >
        <button
          v-for="(step, index) in steps"
          :id="`career-step-${step.id}`"
          :key="step.id"
          type="button"
          class="career-step"
          :class="{
            'career-current': index === activeIndex,
            'career-quiet': step.quiet
          }"
          role="radio"
          :aria-checked="index === activeIndex"
          :aria-label="t('career.step', { title: step.title, organization: step.organization, period: step.period })"
          :tabindex="index === activeIndex ? 0 : -1"
          @click="move(index)"
        >
          <span
            class="career-step-mark"
            aria-hidden="true"
          />
          <span class="career-step-title">{{ step.title }}</span>
          <span class="career-step-org">{{ step.organization }}</span>
          <span class="career-step-period">{{ step.period }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
