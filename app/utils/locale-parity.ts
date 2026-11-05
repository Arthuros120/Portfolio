import en from '../../i18n/locales/en.json'
import fr from '../../i18n/locales/fr.json'

type MessageTree = { [key: string]: string | MessageTree }

function isTree(value: unknown): value is MessageTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertSameKeys(left: MessageTree, right: MessageTree, path = 'root'): void {
  const leftKeys = Object.keys(left).sort()
  const rightKeys = Object.keys(right).sort()

  if (leftKeys.join('|') !== rightKeys.join('|')) {
    throw new Error(`Locale keys differ at ${path}`)
  }

  for (const key of leftKeys) {
    const leftValue = left[key]
    const rightValue = right[key]
    const leftTree = isTree(leftValue)
    const rightTree = isTree(rightValue)

    if (leftTree !== rightTree) {
      throw new Error(`Locale key ${path}.${key} has different shapes`)
    }

    if (leftTree && rightTree) {
      assertSameKeys(leftValue, rightValue, `${path}.${key}`)
    }
  }
}

/**
 * Fail the build when the French and English message files do not share the same keys.
 */
export function assertLocaleParity(): void {
  assertSameKeys(fr, en)

  const enMatchesFr: typeof fr = en
  const frMatchesEn: typeof en = fr

  void enMatchesFr
  void frMatchesEn
}
