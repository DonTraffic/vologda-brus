/**
 * Подключение Яндекс.Метрики и Google Analytics 4.
 *
 * ▸ ГДЕ ЗАДАТЬ НОМЕРА СЧЁТЧИКОВ — в переменных окружения при сборке:
 *
 *     NUXT_PUBLIC_METRIKA_ID=12345678         ← номер счётчика Метрики
 *     NUXT_PUBLIC_GA_ID=G-XXXXXXXXXX          ← идентификатор потока GA4
 *     NUXT_PUBLIC_YANDEX_VERIFICATION=…       ← подтверждение Яндекс.Вебмастера
 *     NUXT_PUBLIC_GOOGLE_VERIFICATION=…       ← подтверждение Search Console
 *
 *   Значения по умолчанию (пустые строки) лежат в `nuxt.config.ts`,
 *   образец файла окружения — в `.env.example`, пошаговый порядок
 *   подключения — в README, раздел «Аналитика».
 *
 * ▸ ЧТО ПРОИСХОДИТ, ЕСЛИ НОМЕР НЕ ЗАДАН: ничего. Скрипт не грузится, в разметку
 *   ничего не добавляется, цели молча никуда не уходят. Это сделано нарочно:
 *   на сборке для проверки счётчик не нужен, а статистику боевого сайта
 *   портить тестовыми заходами нельзя.
 *
 * ▸ ПОЧЕМУ ПЛАГИН УНИВЕРСАЛЬНЫЙ, А НЕ `.client`: теги подтверждения прав
 *   должны попасть в готовый HTML на этапе сборки, иначе Вебмастер и Search
 *   Console их не увидят — они читают страницу без JavaScript. Сами счётчики
 *   при этом запускаются только в браузере.
 *
 * ▸ ЦЕЛИ. Клики по телефону, почте, мессенджерам и маршруту ловятся здесь одним
 *   обработчиком на весь документ, а не разметкой каждой ссылки: ссылок на
 *   телефон пять штук в разных местах, и любая новая подхватится сама.
 *   Отправку форм отмечает `useLeadForm` в момент успешного ответа.
 */
import { GOALS } from '../composables/useAnalytics'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const metrikaId = Number(config.public.metrikaId)
  const gaId = String(config.public.gaId || '')
  const yandexVerification = String(config.public.yandexVerification || '')
  const googleVerification = String(config.public.googleVerification || '')

  // --- Подтверждение прав на сайт -----------------------------------------
  // Попадает в HTML на сборке. Второй способ подтверждения — файлом в корне
  // `public/`, он тоже годится; достаточно любого одного.
  const verificationMeta: { name: string; content: string }[] = []
  if (yandexVerification) {
    verificationMeta.push({ name: 'yandex-verification', content: yandexVerification })
  }
  if (googleVerification) {
    verificationMeta.push({ name: 'google-site-verification', content: googleVerification })
  }

  // --- Счётчик без JavaScript ---------------------------------------------
  // Метрика умеет считать заходы картинкой-пикселем. Нужно потому, что сайт
  // намеренно работает при отключённых скриптах, и такие посетители иначе
  // в статистику не попадут вовсе.
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

  // --- Яндекс.Метрика ------------------------------------------------------
  if (metrikaId) {
    // Очередь вызовов до загрузки tag.js — как в официальном сниппете
    // Метрики: обращения складываются в ym.a, а загрузившийся скрипт их
    // проигрывает. Поле ym.l — метка времени, по ней Метрика определяет,
    // сколько счётчик грузился.
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

    // Параметры из ТЗ (этап 8): карта прокрутки и кликов, запись действий
    // посетителей, точный учёт отказов, учёт переходов по внешним ссылкам.
    window.ym?.(metrikaId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    })
  }

  // --- Google Analytics 4 --------------------------------------------------
  if (gaId) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: unknown[]) { window.dataLayer!.push(args) }
    window.gtag('js', new Date())
    // Переходы между страницами отправляются вручную в trackPageView, иначе
    // при каждом переходе уходил бы второй, лишний просмотр.
    window.gtag('config', gaId, { send_page_view: false })

    const g = document.createElement('script')
    g.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
    g.async = true
    document.head.appendChild(g)
  }

  if (!metrikaId && !gaId) return

  const { reachGoal, trackPageView } = useAnalytics()

  // --- Переходы между страницами ------------------------------------------
  // Первый просмотр счётчики отмечают сами при инициализации, поэтому
  // отправляем только последующие переходы.
  const router = useRouter()
  let first = true
  router.afterEach((to) => {
    if (first) { first = false; return }
    nuxtApp.runWithContext(() => trackPageView(to.fullPath))
  })

  // --- Клики по контактам --------------------------------------------------
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
