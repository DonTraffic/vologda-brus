export const GOALS = {

  formCalc: 'form_calc',

  formConsult: 'form_consult',

  phoneClick: 'phone_click',

  emailClick: 'email_click',

  messenger: 'messenger_click',

  messengerModal: 'messenger_modal',

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

  function reachGoal(goal: GoalName, params?: Record<string, unknown>) {
    if (!import.meta.client) return

    const metrikaId = Number(config.public.metrikaId)
    if (metrikaId && typeof window.ym === 'function') {
      try {
        window.ym(metrikaId, 'reachGoal', goal, params)
      }
      catch {}
    }

    if (config.public.gaId && typeof window.gtag === 'function') {
      try {
        window.gtag('event', goal, params ?? {})
      }
      catch {}
    }
  }

  function trackPageView(path: string) {
    if (!import.meta.client) return

    const metrikaId = Number(config.public.metrikaId)
    if (metrikaId && typeof window.ym === 'function') {
      try {
        window.ym(metrikaId, 'hit', path)
      }
      catch {}
    }

    if (config.public.gaId && typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'page_view', {
          page_path: path,
          page_location: window.location.href,
          page_title: document.title,
        })
      }
      catch {}
    }
  }

  return { reachGoal, trackPageView, GOALS }
}
