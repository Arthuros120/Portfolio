<script setup lang="ts">
/**
 * Light, dark, and auto (system) theme control.
 * `@nuxtjs/color-mode` stores the choice and applies it before paint.
 */
const colorMode = useColorMode()
const { t } = useI18n()
const appConfig = useAppConfig()

const modes = computed(() => [
  { value: 'light' as const, label: t('theme.light'), icon: appConfig.ui.icons.light },
  { value: 'dark' as const, label: t('theme.dark'), icon: appConfig.ui.icons.dark },
  { value: 'system' as const, label: t('theme.system'), icon: appConfig.ui.icons.system }
])

const selected = computed(() => {
  if (colorMode.preference === 'light' || colorMode.preference === 'dark' || colorMode.preference === 'system') {
    return colorMode.preference
  }

  return 'system'
})

function select(value: 'light' | 'dark' | 'system') {
  colorMode.preference = value
}

async function onKeydown(event: KeyboardEvent) {
  const order = ['light', 'dark', 'system'] as const
  const index = order.indexOf(selected.value)
  let next: (typeof order)[number] | undefined

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = order[(index + 1) % order.length]
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = order[(index - 1 + order.length) % order.length]
  }

  if (!next) {
    return
  }

  event.preventDefault()
  select(next)
  await nextTick()

  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.querySelector<HTMLElement>('[aria-checked="true"]')?.focus()
  }
}
</script>

<template>
  <ClientOnly>
    <div
      class="theme-toggle"
      role="radiogroup"
      :aria-label="t('theme.label')"
      @keydown="onKeydown"
    >
      <UButton
        v-for="mode in modes"
        :key="mode.value"
        color="neutral"
        :aria-checked="selected === mode.value"
        :icon="mode.icon"
        :label="mode.label"
        role="radio"
        :tabindex="selected === mode.value ? 0 : -1"
        :variant="selected === mode.value ? 'solid' : 'ghost'"
        @click="select(mode.value)"
      />
    </div>

    <template #fallback>
      <div
        class="theme-toggle"
        aria-hidden="true"
      >
        <UButton
          v-for="mode in modes"
          :key="mode.value"
          color="neutral"
          disabled
          :icon="mode.icon"
          :label="mode.label"
          tabindex="-1"
          variant="ghost"
        />
      </div>
    </template>
  </ClientOnly>
</template>
