<script setup lang="ts">
/**
 * Sticky site header: wordmark, section links, language, and theme.
 * The mobile menu is a dialog: focus stays inside it, Esc closes it,
 * and focus returns to the button that opened it.
 */
const { t } = useI18n()
const localePath = useLocalePath()
const open = ref(false)
const scrolled = ref(false)
const homeHash = computed(() => `${localePath('/')}#top`)

let pendingFocus: HTMLElement | null = null

const menu = computed(() => ({
  title: t('nav.menu'),
  description: t('nav.label'),
  content: {
    id: 'site-menu',
    onCloseAutoFocus: onMenuCloseAutoFocus
  }
}))

function onMenuCloseAutoFocus(event: Event) {
  if (!pendingFocus) {
    return
  }

  event.preventDefault()
}

watch(open, (isOpen) => {
  if (isOpen || !pendingFocus) {
    return
  }

  const target = pendingFocus
  pendingFocus = null

  window.setTimeout(() => {
    const section = target.closest('section') ?? target
    section.scrollIntoView({ block: 'start' })
    target.focus({ preventScroll: true })
  }, 0)
})

function onMenuNavigate(event: MouseEvent) {
  const link = event.target instanceof Element ? event.target.closest('a') : null

  if (!link) {
    return
  }

  const href = link.getAttribute('href') ?? ''
  const hashIndex = href.indexOf('#')
  const id = hashIndex >= 0 ? href.slice(hashIndex + 1) : ''
  const section = id ? document.getElementById(id) : null
  const heading = section?.querySelector<HTMLElement>('h1, h2') ?? section

  if (heading) {
    heading.tabIndex = -1
    pendingFocus = heading
  }

  open.value = false
}

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 4
  }
  const desktop = window.matchMedia('(min-width: 64rem)')
  const closeOnDesktop = () => {
    if (desktop.matches) {
      open.value = false
    }
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  desktop.addEventListener('change', closeOnDesktop)

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    desktop.removeEventListener('change', closeOnDesktop)
  })
})
</script>

<template>
  <UHeader
    v-model:open="open"
    class="site-header"
    :class="{ 'is-scrolled': scrolled }"
    :menu="menu"
    :title="t('brand.name')"
    :to="homeHash"
    :ui="{ title: 'site-wordmark' }"
  >
    <SiteNav orientation="horizontal" />

    <template #right>
      <div class="header-tools">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </template>

    <template #toggle="{ open: isOpen, toggle, ui }">
      <UButton
        :class="[ui.toggle({ toggleSide: 'right' }), 'menu-toggle']"
        color="neutral"
        variant="ghost"
        :aria-controls="isOpen ? 'site-menu' : undefined"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? t('nav.close') : t('nav.open')"
        :icon="isOpen ? 'i-lucide-x' : 'i-lucide-menu'"
        @click="toggle"
      />
    </template>

    <template #body>
      <div @click.capture="onMenuNavigate">
        <SiteNav orientation="vertical" />
      </div>
      <div class="site-menu-tools">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </template>
  </UHeader>
</template>
