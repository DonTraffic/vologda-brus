import { GOALS } from '../composables/useAnalytics'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const metrikaId = Number(config.public.metrikaId)
  const gaId = String(config.public.gaId || '')
  const yandexVerification = String(config.public.yandexVerification || '')
  const googleVerification = String(config.public.googleVerification || '')

  const verificationMeta: { name: string; content: string }[] = []
  if (yandexVerification) {
    verificationMeta.push({ name: 'yandex-verification', content: yandexVerification })
  }
  if (googleVerification) {
    verificationMeta.push({ name: 'google-site-verification', content: googleVerification })
  }

  const head: Parameters<typeof useHead>[0] = {}
  if (verificationMeta.length) head.meta = verificationMeta
  if (metrikaId) {
    head.noscript = [{
      innerHTML: `<div><img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute;left:-9999px" alt="" /></div>`,
      tagPosition: 'bodyClose',
    }]
  }
  if (Object.keys(head).length) useHead(head)

  if (!import.meta.client) return

  if (metrikaId) {

    type YmQueue = NonNullable<typeof window.ym> & { a?: unknown[][]; l?: number }
    if (!window.ym) {
      const queued = function (...args: unknown[]) {
        queued.a = queued.a || []
        queued.a.push(args)
      } as YmQueue
      window.ym = queued
    }
    ;(window.ym as YmQueue).l = Date.now()

    const s = document.createElement('script')
    s.src = 'https://mc.yandex.ru/metrika/tag.js'
    s.async = true
    document.head.appendChild(s)

    window.ym?.(metrikaId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    })
  }

  if (gaId) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: unknown[]) { window.dataLayer!.push(args) }
    window.gtag('js', new Date())

    window.gtag('config', gaId, { send_page_view: false })

    const g = document.createElement('script')
    g.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
    g.async = true
    document.head.appendChild(g)
  }

  if (!metrikaId && !gaId) return

  const { reachGoal, trackPageView } = useAnalytics()

  const router = useRouter()
  let first = true
  router.afterEach((to) => {
    if (first) { first = false; return }
    nuxtApp.runWithContext(() => trackPageView(to.fullPath))
  })

  const MESSENGER_HOSTS: Record<string, string> = {
    't.me': 'telegram',
    'telegram.me': 'telegram',
    'max.ru': 'max',
    'wa.me': 'whatsapp',
    'api.whatsapp.com': 'whatsapp',
  }

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null
    const link = target?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!link) return

    const href = link.getAttribute('href') || ''

    if (href.startsWith('tel:')) {
      reachGoal(GOALS.phoneClick, { place: link.className || 'без класса' })
      return
    }
    if (href.startsWith('mailto:')) {
      reachGoal(GOALS.emailClick)
      return
    }

    let host = ''
    try { host = new URL(href, window.location.origin).hostname.replace(/^www\./, '') }
    catch { return }

    const messenger = MESSENGER_HOSTS[host]
    if (messenger) {
      reachGoal(GOALS.messenger, { messenger })
      return
    }
    if (host === 'yandex.ru' && href.includes('/maps')) {
      reachGoal(GOALS.route)
    }
  }, { capture: true, passive: true })
})
