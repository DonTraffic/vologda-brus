const SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
}

const LOCAL = /^(localhost|127\.0\.0\.1|\[?::1\]?)(:|$)/
const TEMPORARY = /\.twc1\.net$/

export default defineNitroPlugin((nitro) => {
  const canonical = new URL(String(useRuntimeConfig().public.siteUrl)).host

  nitro.hooks.hook('request', (event) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      setHeader(event, name, value)
    }

    if (import.meta.prerender) return

    const { pathname, search } = getRequestURL(event)

    const host = getRequestHost(event, { xForwardedHost: true }) || ''
    if (host && host !== canonical && !LOCAL.test(host) && !TEMPORARY.test(host)) {
      return sendRedirect(event, `https://${canonical}${pathname}${search}`, 301)
    }
    if (pathname === '/' || pathname.endsWith('/')) return
    if (pathname.startsWith('/api/')) return
    if (pathname.slice(pathname.lastIndexOf('/')).includes('.')) return

    return sendRedirect(event, `${pathname}/${search}`, 308)
  })
})
