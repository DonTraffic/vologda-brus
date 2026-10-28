/**
 * Отправка заявки.
 *
 * КУДА УХОДИТ. Адрес приёмника задаётся переменной NUXT_PUBLIC_FORM_ENDPOINT,
 * значение по умолчанию — в `nuxt.config.ts`. Там пусто: пока приёмник не
 * задан, форма честно показывает, что приём не настроен, и предлагает
 * позвонить или написать в мессенджер. Молча терять заявки она не будет.
 *
 * ПОЧЕМУ НЕ ВНЕШНИЙ СЕРВИС. Соблазн велик — FormSubmit и подобные службы
 * принимают форму со статического сайта без всякого кода. Но заявка с именем
 * и телефоном легла бы первой записью на иностранный сервер, а ч. 5 ст. 18
 * 152-ФЗ с 01.07.2025 запрещает использовать зарубежные базы на этапе сбора
 * персональных данных граждан России. То же относится к ящику-получателю:
 * пересылать заявки на gmail нельзя по той же причине.
 *
 * ПРАВИЛЬНЫЙ ПРИЁМНИК — собственный маршрут на том же домене (`/api/lead`),
 * который принимает POST и отправляет письмо через smtp.timeweb.ru на ящик
 * заказчика. Данные при этом не покидают Россию. Маршрут требует бэкенд-
 * тарифа App Platform: у статики нет исполняемого кода, а SMTP браузеру
 * недоступен в принципе. Порядок подключения — `deploy/timeweb.md`.
 *
 * Сам состав письма формируется здесь, на стороне приёмника остаётся только
 * отправка: так смена приёмника не тянет за собой переписывание полей.
 */
export interface LeadPayload {
  formName: string
  [key: string]: string
}

/**
 * Человеческие названия полей: именно они становятся строками в письме.
 * Без этого в почту приходят `formName` и `way`, и заявку приходится
 * расшифровывать.
 */
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

  /**
   * @param goal имя цели аналитики — отправляется только при успешном приёме
   *             заявки. Имена собраны в GOALS (`useAnalytics`), в интерфейсе
   *             Метрики цель создаётся с тем же идентификатором.
   */
  async function submit(payload: LeadPayload, honeypot: string, goal?: string) {
    // Скрытое поле, которое заполняют только роботы. Защиты от спама
    // на текущем сайте нет вообще ни на одной форме.
    // Роботу показываем успех, но цель не отмечаем — иначе статистика заявок
    // наполнится спамом.
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

    // Пустые поля в письмо не кладём: у формы расчёта, например, имя не
    // спрашивается, и строка «Имя: —» в заявке только мешает.
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

      // Свой маршрут на отказ отвечает кодом ошибки, и $fetch бросает сам.
      // Но приёмник может ответить и двухсоткой с отказом в теле — такой
      // случай ловим явно, иначе посетитель увидит «отправлено», а заявки
      // не будет.
      const said = res as { ok?: unknown, error?: unknown } | null
      if (said && typeof said === 'object' && said.ok === false) {
        throw new Error(String(said.error ?? 'приёмник отклонил заявку'))
      }

      state.value = 'done'
      if (goal) reachGoal(goal, { form: payload.formName })
    }
    catch (e) {
      state.value = 'error'
      errorText.value = 'Не удалось отправить. Позвоните нам или напишите в мессенджер.'
      // Посетителю показываем человеческую строку, а причину оставляем в
      // консоли: без неё непонятно, лежит приёмник или не подтверждён адрес.
      console.warn('[заявка] приёмник не принял:', e instanceof Error ? e.message : e)
    }
  }

  return { state, errorText, submit, endpoint }
}
