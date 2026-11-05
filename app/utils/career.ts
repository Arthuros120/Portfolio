/**
 * Timeline helpers for the path section.
 * Retail and restaurant roles stay in the data, and stay visually quiet.
 */
const quietExperienceTags = new Set(['retail', 'restaurant'])

/**
 * True when a step should not take the visual lead on the timeline.
 */
export function isQuietExperience(tags: readonly string[] | undefined): boolean {
  return (tags ?? []).some(tag => quietExperienceTags.has(tag))
}

/**
 * Center of a step column, as a percentage of the track width.
 * One step sits in the middle. The boat uses the same anchor.
 */
export function stepAnchor(index: number, count: number): number {
  if (count <= 0) {
    return 50
  }

  const safeIndex = Math.min(count - 1, Math.max(0, index))
  return ((safeIndex + 0.5) / count) * 100
}
