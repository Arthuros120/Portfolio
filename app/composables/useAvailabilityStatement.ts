/**
 * Openness sentence shared by the hero and the contact section.
 * The contract ids come from YAML. The wording comes from the locales.
 */
export function useAvailabilityStatement() {
  const { locale, t } = useI18n()
  const { availability } = usePortfolioContent()

  const statement = computed(() => {
    const labels = availability.openTo.map(id => t(`availability.contracts.${id}`))

    return t('availability.open', {
      list: joinContractTypes(labels, locale.value)
    })
  })

  return { statement }
}
