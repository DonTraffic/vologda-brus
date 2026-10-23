/**
 * Отправка заявки.
 *
 * Адрес приёмника задаётся переменной NUXT_PUBLIC_FORM_ENDPOINT. Пока он не
 * задан, форма не делает вид, что всё отправилось: показывает честную ошибку.
 * На текущем сайте заявки уходят через Тильду, и при переезде приёмник нужно
 * подключить свой — свой бэкенд, Formspree или бот в Telegram.
 */
export interface LeadPayload {
  formName: string
  [key: string]: string
}

export function useLeadForm() {
  const config = useRuntimeConfig()
  const endpoint = computed(() => config.public.formEndpoint as string)

  const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
  const errorText = ref('')

  async function submit(payload: LeadPayload, honeypot: string) {
    // Скрытое поле, которое заполняют только роботы. Защиты от спама
    // на текущем сайте нет вообще ни на одной форме.
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

    try {
      await $fetch(endpoint.value, {
        method: 'POST',
        body: { ...payload, page: useRoute().fullPath },
      })
      state.value = 'done'
    } catch {
      state.value = 'error'
      errorText.value = 'Не удалось отправить. Позвоните нам или напишите в мессенджер.'
    }
  }

  return { state, errorText, submit, endpoint }
}
