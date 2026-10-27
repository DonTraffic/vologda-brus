/**
 * Цели аналитики — одна точка для Яндекс.Метрики и Google Analytics.
 *
 * Счётчики подключает плагин `plugins/analytics.ts`, идентификаторы берутся
 * из переменных окружения (см. `.env.example` и раздел «Аналитика» в README).
 * Пока идентификаторы не заданы, обе функции ничего не делают и в консоль не
 * ругаются — сайт работает как обычно.
 *
 * Зачем свой слой, а не вызов `ym()` по месту: цели нужны в обоих счётчиках
 * одновременно, имена должны совпадать, и ни одна кнопка не должна падать,
 * если скрипт счётчика заблокирован расширением в браузере посетителя.
 */

/** Цели, которые ТЗ просит считать (этап 8). Имена те же в обоих счётчиках. */
export const GOALS = {
  /** Отправлена форма расчёта с главной. */
  formCalc: 'form_calc',
  /** Отправлена форма консультации (главная и страница дилеров). */
  formConsult: 'form_consult',
  /** Клик по номеру телефона. */
  phoneClick: 'phone_click',
  /** Клик по адресу почты. */
  emailClick: 'email_click',
  /** Переход в мессенджер: telegram, max, whatsapp. */
  messenger: 'messenger_click',
  /** Открыто окно выбора мессенджера. */
  messengerModal: 'messenger_modal',
  /** Клик по ссылке на Яндекс.Карты — построение маршрута. */
  route: 'route_click',
} as const

export type GoalName = (typeof GOALS)[keyof typeof GOALS] | string

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function useAnalytics() {
  const config = useRuntimeConfig()

  /**
   * Отправить цель в оба счётчика.
   *
   * @param goal   имя цели — лучше из GOALS, чтобы совпадало с настройками
   *               в интерфейсе Метрики
   * @param params необязательные подробности (например, имя формы). Метрика
   *               принимает их как параметры визита, GA — как параметры события
   */
  function reachGoal(goal: GoalName, params?: Record<string, unknown>) {
    if (!import.meta.client) return

    const metrikaId = Number(config.public.metrikaId)
    if (metrikaId && typeof window.ym === 'function') {
      try {
        window.ym(metrikaId, 'reachGoal', goal, params)
      }
      catch {
        // Счётчик может быть заблокирован расширением — это не причина
        // ломать кнопку, по которой человек только что щёлкнул.
      }
    }

    if (config.public.gaId && typeof window.gtag === 'function') {
      try {
        window.gtag('event', goal, params ?? {})
      }
      catch { /* см. выше */ }
    }
  }

  /**
   * Сообщить счётчикам о переходе на другую страницу.
   *
   * Нужно потому, что после загрузки сайт работает как одно приложение:
   * страницы меняются без перезагрузки, и сами счётчики этого не замечают.
   * Вызывается из плагина на каждом переходе, руками дёргать не нужно.
   */
  function trackPageView(path: string) {
    if (!import.meta.client) return

    const metrikaId = Number(config.public.metrikaId)
    if (metrikaId && typeof window.ym === 'function') {
      try {
        window.ym(metrikaId, 'hit', path)
      }
      catch { /* см. выше */ }
    }

    if (config.public.gaId && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'page_view', {
          page_path: path,
          page_location: window.location.href,
          page_title: document.title,
        })
      }
      catch { /* см. выше */ }
    }
  }

  return { reachGoal, trackPageView, GOALS }
}
