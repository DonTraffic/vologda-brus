import { POSTS } from '~~/app/data/posts'

const STATIC_ROUTES = ['/', '/blog/', '/dealers/', '/privacy-policy/']

export default defineEventHandler((event) => {
  const site = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')

  const routes = [
    ...STATIC_ROUTES,
    ...POSTS.map(p => `/blog/${p.slug}/`),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url><loc>${site}${r}</loc></url>`).join('\n')}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
