/**
 * Build the sitemap and robots files from the public origin.
 * Without an https origin the locations stay root-relative and robots says so.
 */

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function absolute(origin: string | undefined, path: string): string {
  if (!origin) {
    return path
  }

  if (path === '/') {
    return `${origin}/`
  }

  return `${origin}${path}`
}

function alternates(fr: string, en: string): string {
  const links: Array<[string, string]> = [
    ['fr-FR', fr],
    ['en-US', en],
    ['x-default', fr]
  ]

  return links
    .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}"/>`)
    .join('\n')
}

/**
 * Sitemap for the French and English landing pages.
 */
export function sitemapDocument(origin: string | undefined): string {
  const fr = absolute(origin, '/')
  const en = absolute(origin, '/en')
  const urls = [fr, en].map(href => `  <url>\n    <loc>${escapeXml(href)}</loc>\n${alternates(fr, en)}\n  </url>`)

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls.join('\n'),
    '</urlset>',
    ''
  ].join('\n')
}

/**
 * robots.txt that allows the static site and points at the sitemap.
 */
export function robotsDocument(origin: string | undefined): string {
  const lines = [
    'User-agent: *',
    'Allow: /',
    ''
  ]

  if (!origin) {
    lines.push('# profile.siteUrl is [TO PROVIDE]. Absolute URLs appear once it is an https origin.')
  }

  lines.push(`Sitemap: ${origin ? `${origin}/sitemap.xml` : '/sitemap.xml'}`)
  lines.push('')

  return lines.join('\n')
}
