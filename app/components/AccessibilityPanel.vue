<script setup lang="ts">
import { a11yTextSizes, type A11yTextSize } from '~/utils/accessibility'

/**
 * Discrete control that opens a small reading panel.
 * Escape closes it and returns focus to the button that opened it.
 */
const { t } = useI18n()
const { font, textSize, contrast, setFont, setTextSize, setContrast } = useAccessibility()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const panelId = useId()
const fontLabelId = `${panelId}-font`
const fontHintId = `${panelId}-font-hint`
const textLabelId = `${panelId}-text`
const contrastLabelId = `${panelId}-contrast`
const contrastHintId = `${panelId}-contrast-hint`
const titleId = `${panelId}-title`

const textOptions = computed(() => [
  { value: 'md' as const, label: t('a11y.textMd') },
  { value: 'lg' as const, label: t('a11y.textLg') },
  { value: 'xl' as const, label: t('a11y.textXl') }
])

function trigger(): HTMLElement | null {
  return root.value?.querySelector<HTMLElement>('.a11y-trigger') ?? null
}

function tabbable(): HTMLElement[] {
  if (!panel.value) {
    return []
  }

  return [...panel.value.querySelectorAll<HTMLElement>('button, [href], input, select, textarea')].filter((element) => {
    return !element.hasAttribute('disabled') && element.tabIndex >= 0
  })
}

async function openPanel() {
  open.value = true
  await nextTick()
  panel.value?.querySelector<HTMLElement>('[role="switch"]')?.focus()
}

function closePanel(restoreFocus: boolean) {
  if (!open.value) {
    return
  }

  open.value = false

  if (!restoreFocus) {
    return
  }

  nextTick(() => {
    trigger()?.focus()
  })
}

function togglePanel() {
  if (open.value) {
    closePanel(false)
    return
  }

  void openPanel()
}

function toggleFont() {
  setFont(font.value === 'dyslexia' ? 'default' : 'dyslexia')
}

function toggleContrast() {
  setContrast(contrast.value === 'strong' ? 'default' : 'strong')
}

function onTextKeydown(event: KeyboardEvent) {
  const order = a11yTextSizes
  const index = order.indexOf(textSize.value)
  let next: A11yTextSize | undefined

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = order[(index + 1) % order.length]
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = order[(index - 1 + order.length) % order.length]
  }

  if (!next) {
    return
  }

  event.preventDefault()
  setTextSize(next)

  nextTick(() => {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.querySelector<HTMLElement>('[aria-checked="true"]')?.focus()
    }
  })
}

function onPointerDown(event: PointerEvent) {
  if (!open.value || !root.value) {
    return
  }

  if (event.target instanceof Node && root.value.contains(event.target)) {
    return
  }

  closePanel(false)
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value || !root.value) {
    return
  }

  const target = event.target
  const inside = target instanceof Node && root.value.contains(target)

  if (!inside) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closePanel(true)
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const items = tabbable()
  const first = items[0]
  const last = items[items.length - 1]

  if (!first || !last) {
    return
  }

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown, true)

  onUnmounted(() => {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeydown, true)
  })
})
</script>

<template>
  <div
    ref="root"
    class="a11y-control"
  >
    <UButton
      class="a11y-trigger"
      color="neutral"
      variant="ghost"
      icon="i-lucide-accessibility"
      :aria-controls="open ? panelId : undefined"
      :aria-expanded="open"
      :aria-label="open ? t('a11y.close') : t('a11y.open')"
      @click="togglePanel"
    />

    <div
      v-if="open"
      :id="panelId"
      ref="panel"
      class="a11y-panel"
      role="dialog"
      aria-modal="false"
      :aria-labelledby="titleId"
    >
      <p
        :id="titleId"
        class="a11y-panel-title"
      >
        {{ t('a11y.panel') }}
      </p>

      <div
        class="a11y-font"
        role="group"
        :aria-labelledby="fontLabelId"
      >
        <p
          :id="fontLabelId"
          class="a11y-label"
        >
          {{ t('a11y.font') }}
        </p>
        <UButton
          class="a11y-switch"
          color="neutral"
          role="switch"
          :aria-checked="font === 'dyslexia'"
          :aria-describedby="fontHintId"
          :variant="font === 'dyslexia' ? 'solid' : 'outline'"
          @click="toggleFont"
        >
          {{ t('a11y.dyslexia') }}
        </UButton>
        <p
          :id="fontHintId"
          class="a11y-hint"
        >
          {{ t('a11y.dyslexiaHint') }}
        </p>
      </div>

      <div class="a11y-text">
        <p
          :id="textLabelId"
          class="a11y-label"
        >
          {{ t('a11y.textSize') }}
        </p>
        <div
          class="a11y-sizes"
          role="radiogroup"
          :aria-labelledby="textLabelId"
          @keydown="onTextKeydown"
        >
          <UButton
            v-for="option in textOptions"
            :key="option.value"
            color="neutral"
            role="radio"
            :aria-checked="textSize === option.value"
            :tabindex="textSize === option.value ? 0 : -1"
            :variant="textSize === option.value ? 'solid' : 'ghost'"
            @click="setTextSize(option.value)"
          >
            {{ option.label }}
          </UButton>
        </div>
      </div>

      <div
        class="a11y-contrast"
        role="group"
        :aria-labelledby="contrastLabelId"
      >
        <p
          :id="contrastLabelId"
          class="a11y-label"
        >
          {{ t('a11y.contrast') }}
        </p>
        <UButton
          class="a11y-switch"
          color="neutral"
          role="switch"
          :aria-checked="contrast === 'strong'"
          :aria-describedby="contrastHintId"
          :variant="contrast === 'strong' ? 'solid' : 'outline'"
          @click="toggleContrast"
        >
          {{ t('a11y.contrastStrong') }}
        </UButton>
        <p
          :id="contrastHintId"
          class="a11y-hint"
        >
          {{ t('a11y.contrastHint') }}
        </p>
      </div>

      <UButton
        class="a11y-close"
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        :aria-label="t('a11y.close')"
        @click="closePanel(true)"
      />
    </div>
  </div>
</template>
