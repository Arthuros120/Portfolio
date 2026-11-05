<script setup lang="ts">
/**
 * Interim-contract countdown. The day count is corrected before hydration
 * so the first paint matches the visitor's calendar, without moving the layout.
 * The plain status sentence stays available to assistive tech. The day line does not.
 */
const { t, locale } = useI18n()
const { profile } = usePortfolioContent()
const { untilDate, timeZone } = profile.availability

const now = ref(Date.now())
const days = computed(() => daysUntilAvailable(untilDate, timeZone, now.value))
const contractDate = computed(() => formatContractDate(untilDate, locale.value))

const status = computed(() => {
  if (days.value <= 0) {
    return t('availability.availableNow')
  }

  return t('availability.until', { date: contractDate.value })
})

const countdown = computed(() => {
  if (days.value <= 0) {
    return ''
  }

  if (days.value === 1) {
    return t('availability.countdownOne')
  }

  return t('availability.countdownMany', { count: days.value })
})

onMounted(() => {
  const timer = window.setInterval(() => {
    now.value = Date.now()
  }, 60_000)

  onUnmounted(() => {
    window.clearInterval(timer)
  })
})

onPrehydrate((el) => {
  const count = el.querySelector('[data-availability-count]')
  const statusNode = el.querySelector('[data-availability-status]')

  if (!(count instanceof HTMLElement) || !(statusNode instanceof HTMLElement)) {
    return
  }

  const until = count.dataset.until || ''
  const zone = count.dataset.zone || 'UTC'
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(until)

  if (!match) {
    return
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const untilIndex = Math.floor(Date.UTC(year, month - 1, day) / 86400000)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date())
  const yearNow = Number(parts.find(part => part.type === 'year')?.value)
  const monthNow = Number(parts.find(part => part.type === 'month')?.value)
  const dayNow = Number(parts.find(part => part.type === 'day')?.value)
  const todayIndex = Math.floor(Date.UTC(yearNow, monthNow - 1, dayNow) / 86400000)
  const remaining = (untilIndex + 1) - todayIndex

  if (remaining <= 0) {
    statusNode.textContent = statusNode.dataset.available || ''
    count.textContent = ''
    return
  }

  if (remaining === 1) {
    count.textContent = count.dataset.one || ''
    return
  }

  count.textContent = (count.dataset.many || '').replaceAll('%%', String(remaining))
})
</script>

<template>
  <div class="availability">
    <p class="availability-open">
      {{ t('availability.open') }}
    </p>
    <p
      class="availability-status"
      data-availability-status
      :data-available="t('availability.availableNow')"
    >
      {{ status }}
    </p>
    <p
      class="availability-count"
      data-availability-count
      aria-hidden="true"
      :data-until="untilDate"
      :data-zone="timeZone"
      :data-one="t('availability.countdownOne')"
      :data-many="t('availability.countdownMany', { count: '%%' })"
    >
      {{ countdown }}
    </p>
  </div>
</template>
