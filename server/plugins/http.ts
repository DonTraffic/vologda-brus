const SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
}

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('request', (event) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      setHeader(event, name, value)
    }

    const { pathname, search } = getRequestURL(event)
    if (pathname === '/' || pathname.endsWith('/')) return
    if (pathname.startsWith('/api/')) return
    if (pathname.slice(pathname.lastIndexOf('/')).includes('.')) return

    return sendRedirect(event, `${pathname}/${search}`, 308)
  })
})
