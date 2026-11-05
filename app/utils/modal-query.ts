import type { LocationQuery, LocationQueryValue } from 'vue-router'

/**
 * Query keys that open a dialog, from the back of the stack to the front.
 * `image` sits above `project`, so Back closes the image first.
 * Later slices add a key here when they need another layer.
 */
export const modalQueryKeys = ['project', 'image', 'step'] as const

export type ModalQueryKey = typeof modalQueryKeys[number]

export interface ModalLayer {
  key: ModalQueryKey
  id: string
}

const modalIdPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,80}$/

/**
 * Content ids that are safe to copy into the query string.
 */
export function isModalId(value: string): boolean {
  return modalIdPattern.test(value)
}

function firstModalId(value: LocationQueryValue | LocationQueryValue[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value

  if (typeof raw !== 'string' || !isModalId(raw)) {
    return null
  }

  return raw
}

/**
 * Layers currently encoded in the route query, back to front.
 */
export function readModalStack(query: LocationQuery): ModalLayer[] {
  const stack: ModalLayer[] = []

  for (const key of modalQueryKeys) {
    const id = firstModalId(query[key])

    if (id) {
      stack.push({ key, id })
    }
  }

  return stack
}

function isModalQueryKey(value: string): value is ModalQueryKey {
  return (modalQueryKeys as readonly string[]).includes(value)
}

/**
 * Copy a query without the given modal keys.
 */
export function omitModalKeys(query: LocationQuery, keys: readonly ModalQueryKey[]): LocationQuery {
  const drop = new Set<string>(keys)
  const next: LocationQuery = {}

  for (const [name, value] of Object.entries(query)) {
    if (drop.has(name) || value === undefined) {
      continue
    }

    next[name] = value
  }

  return next
}

/**
 * Drop modal keys that are not stable ids. Returns null when nothing changes.
 */
export function withoutInvalidModalKeys(query: LocationQuery): LocationQuery | null {
  const next: LocationQuery = {}
  let dirty = false

  for (const [name, value] of Object.entries(query)) {
    if (value === undefined) {
      continue
    }

    if (!isModalQueryKey(name)) {
      next[name] = value
      continue
    }

    const id = firstModalId(value)
    const already = !Array.isArray(value) && value === id

    if (id && already) {
      next[name] = value
      continue
    }

    dirty = true

    if (id) {
      next[name] = id
    }
  }

  return dirty ? next : null
}

function stackFromSearch(search: string): ModalLayer[] {
  const params = new URLSearchParams(search)
  const stack: ModalLayer[] = []

  for (const key of modalQueryKeys) {
    const value = params.get(key)

    if (value && isModalId(value)) {
      stack.push({ key, id: value })
    }
  }

  return stack
}

function pathnameOf(path: string): string {
  const hashAt = path.indexOf('#')
  const withoutHash = hashAt >= 0 ? path.slice(0, hashAt) : path
  const queryAt = withoutHash.indexOf('?')

  return queryAt >= 0 ? withoutHash.slice(0, queryAt) : withoutHash
}

function searchOf(path: string): string {
  const hashAt = path.indexOf('#')
  const withoutHash = hashAt >= 0 ? path.slice(0, hashAt) : path
  const queryAt = withoutHash.indexOf('?')

  return queryAt >= 0 ? withoutHash.slice(queryAt) : ''
}

function sameStack(left: ModalLayer[], right: ModalLayer[]): boolean {
  if (left.length !== right.length) {
    return false
  }

  return left.every((layer, index) => layer.key === right[index]?.key && layer.id === right[index]?.id)
}

/**
 * True when `back` is this page with exactly one fewer modal layer.
 * That history entry is the one Back should restore.
 */
export function isModalHistoryParent(back: unknown, path: string, query: LocationQuery): boolean {
  if (typeof back !== 'string' || !back.startsWith('/')) {
    return false
  }

  if (pathnameOf(back) !== path) {
    return false
  }

  const current = readModalStack(query)

  return sameStack(stackFromSearch(searchOf(back)), current.slice(0, -1))
}

interface HistorySeedState {
  back: string | null
  current: string
  forward: string | null
  replaced: boolean
  position: number
  scroll: null
}

/**
 * Give a cold modal link a same-page entry underneath it.
 * Call this before the router reads `history.state`.
 * Back then closes the top layer and stays on the page; Forward opens it again.
 */
export function seedModalHistory(): void {
  if (!import.meta.client) {
    return
  }

  try {
    const stack = stackFromSearch(window.location.search)

    if (!stack.length) {
      return
    }

    const state = window.history.state as { back?: unknown, position?: unknown } | null

    if (isModalHistoryParent(state?.back, window.location.pathname, queryFromLocation())) {
      return
    }

    const basePosition = typeof state?.position === 'number'
      ? state.position
      : window.history.length - 1
    const previousBack = typeof state?.back === 'string' ? state.back : null
    const urls = [urlFor([])]

    for (let index = 0; index < stack.length; index += 1) {
      urls.push(urlFor(stack.slice(0, index + 1)))
    }

    urls[urls.length - 1] = window.location.pathname + window.location.search + window.location.hash

    urls.forEach((url, index) => {
      const entry: HistorySeedState = {
        back: index === 0 ? previousBack : urls[index - 1] ?? null,
        current: url,
        forward: urls[index + 1] ?? null,
        replaced: index === 0,
        position: basePosition + index,
        scroll: null
      }

      if (index === 0) {
        window.history.replaceState(entry, '', url)
        return
      }

      window.history.pushState(entry, '', url)
    })
  } catch {
    // Some embedded browsers reject history updates. The query still opens the dialog.
  }
}

function queryFromLocation(): LocationQuery {
  const params = new URLSearchParams(window.location.search)
  const query: LocationQuery = {}

  for (const key of modalQueryKeys) {
    const value = params.get(key)

    if (value) {
      query[key] = value
    }
  }

  return query
}

function urlFor(layers: ModalLayer[]): string {
  const params = new URLSearchParams(window.location.search)

  for (const key of modalQueryKeys) {
    params.delete(key)
  }

  for (const layer of layers) {
    params.set(layer.key, layer.id)
  }

  const query = params.toString()

  return window.location.pathname + (query ? `?${query}` : '') + window.location.hash
}
