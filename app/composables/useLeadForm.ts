export interface LeadPayload {
  formName: string
  [key: string]: string
}

const FIELD_LABELS: Record<string, string> = {
  formName: 'Форма',
  name: 'Имя',
  contact: 'Контакт',
  way: 'Способ связи',
  expert: 'Кому вопрос',
  question: 'Вопрос',
  page: 'Страница',
}

export function useLeadForm() {
  const config = useRuntimeConfig()
  const route = useRoute()
  const endpoint = computed(() => config.public.formEndpoint as string)
  const { reachGoal } = useAnalytics()

  const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
  const errorText = ref('')

  const MESSAGES: Record<string, string> = {
    not_configured: 'Приём заявок пока не настроен. Напишите нам в мессенджер или позвоните.',
    rate_limited: 'Слишком много попыток подряд. Подождите минуту или позвоните нам.',
  }

  async function submit(payload: LeadPayload, honeypot: string, goal?: string) {

    if (honeypot) {
      state.value = 'done'
      return
    }

    if (!endpoint.value) {
      state.value = 'error'
      errorText.value = 'Приём заявок пока не настроен. Напишите нам в мессенджер или позвоните.'
      return
    }

    state.value = 'sending'
    errorText.value = ''

    const letter: Record<string, string> = {}
    for (const [key, value] of Object.entries({ ...payload, page: route.fullPath })) {
      const text = String(value ?? '').trim()
      if (text) letter[FIELD_LABELS[key] ?? key] = text
    }

    try {
      const res = await $fetch<unknown>(endpoint.value, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: {
          subject: `Заявка с сайта: ${payload.formName}`,
          fields: letter,
        },
      })

      const said = res as { ok?: unknown, error?: unknown } | null
      if (said && typeof said === 'object' && said.ok === false) {
        throw Object.assign(new Error('приёмник отклонил заявку'), { reason: said.error })
      }

      state.value = 'done'
      if (goal) reachGoal(goal, { form: payload.formName })
    }
    catch (e) {
      const payloadError = (e as { data?: { error?: string }, reason?: string })
      const reason = payloadError?.data?.error || payloadError?.reason || ''

      state.value = 'error'
      errorText.value = MESSAGES[reason] || 'Не удалось отправить. Позвоните нам или напишите в мессенджер.'

      console.warn('[заявка] приёмник не принял:', reason || (e instanceof Error ? e.message : e))
    }
  }

  return { state, errorText, submit, endpoint }
}
