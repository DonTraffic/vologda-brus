import { fileURLToPath } from 'node:url'

// Основной адрес сайта. Используется для canonical, og:url и карты сайта.
// Менять здесь одно место — остальное подтянется.
const SITE_URL = 'https://vologda-brus.ru'

export default defineNuxtConfig({
  compatibilityDate: '2025-10-01',
  devtools: { enabled: true },

  // Статическая генерация: сайт собирается в готовый HTML и раздаётся
  // любым веб-сервером. SSR включён — именно он и формирует HTML на этапе
  // сборки, поэтому контент виден поисковику без JavaScript.
  ssr: true,

  css: ['~/assets/scss/main.scss'],

  // Базовые компоненты из ui/ регистрируются без префикса папки:
  // <BaseButton>, а не <UiBaseButton>. Для layout/ и sections/ префикс
  // оставлен — он помогает различать уровни в шаблонах страниц.
  components: [
    { path: '~/components/ui', pathPrefix: false },
    '~/components',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // loadPaths позволяет писать @use "abstracts" без относительных путей,
          // а additionalData делает токены и миксины доступными в каждом
          // <style lang="scss"> без повторного импорта в каждом компоненте.
          loadPaths: [fileURLToPath(new URL('./app/assets/scss', import.meta.url))],
          additionalData: '@use "abstracts" as *;\n',
        },
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#114c3e' },

        // Единственный из пяти защитных заголовков, который можно задать
        // из самой страницы: при переходе наружу адрес страницы не уедет
        // целиком, уйдёт только имя домена. Остальные четыре — HSTS,
        // X-Content-Type-Options, X-Frame-Options и Permissions-Policy —
        // бывают только настоящими заголовками ответа, их надо включать
        // в панели хостинга: deploy/timeweb.md, пункт 4.
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,

      // Приёмник заявок. Задаётся через NUXT_PUBLIC_FORM_ENDPOINT.
      //
      // Пусто по умолчанию, и это сделано нарочно: пока приёмник не задан,
      // форма честно сообщает, что приём не настроен, вместо того чтобы
      // молча терять заявки.
      //
      // ЧЕГО СЮДА СТАВИТЬ НЕЛЬЗЯ — внешние службы приёма форм (FormSubmit,
      // Formspree и подобные). Имя и телефон посетителя легли бы первой
      // записью на иностранный сервер, а ч. 5 ст. 18 152-ФЗ с 01.07.2025
      // прямо запрещает использовать зарубежные базы на этапе сбора.
      //
      // Рабочий вариант — собственный маршрут на том же домене, который
      // принимает заявку и отправляет письмо через smtp.timeweb.ru. Тогда
      // здесь стоит '/api/lead'. Порядок подключения — deploy/timeweb.md.
      formEndpoint: '',

      // --- Аналитика ------------------------------------------------------
      // Здесь только значения по умолчанию. Подставлять номера надо не сюда,
      // а в переменные окружения при сборке — иначе они уедут в репозиторий,
      // а на сборке для проверки будут портить статистику боевого сайта.
      // Образец — `.env.example`, порядок подключения — README, «Аналитика».
      // Подключением занимается `app/plugins/analytics.ts`.

      // Номер счётчика Яндекс.Метрики, только цифры.
      // NUXT_PUBLIC_METRIKA_ID — счётчик нужен новый: переносимый сайт
      // вологдабрус.рф аналитики не имел вовсе, наследовать нечего.
      metrikaId: '',

      // Идентификатор потока данных Google Analytics 4, вида G-XXXXXXXXXX.
      // NUXT_PUBLIC_GA_ID
      gaId: '',

      // Содержимое тега подтверждения прав в Яндекс.Вебмастере.
      // NUXT_PUBLIC_YANDEX_VERIFICATION
      yandexVerification: '',

      // Содержимое тега подтверждения прав в Google Search Console.
      // NUXT_PUBLIC_GOOGLE_VERIFICATION
      googleVerification: '',
    },
  },

  hooks: {
    // Библиотека карты (maplibre-gl) весит 1,05 МБ без сжатия. По замыслу
    // ContactsMap она подгружается только когда подвал с картой доезжает до
    // экрана — так и написано в самом компоненте. Но Nuxt добавляет на каждую
    // страницу <link rel="prefetch"> на этот кусок и скачивает его заранее,
    // в том числе на политике конфиденциальности и странице 404. Замысел
    // обесценивается, а мегабайт уходит даже тем, кто до подвала не досмотрел.
    //
    // Снимаем предзагрузку только у карты. Остальные куски Nuxt продолжает
    // прокачивать как раньше — переходы между страницами не замедляются.
    'build:manifest'(manifest) {
      for (const entry of Object.values(manifest)) {
        if (String(entry.src || '').includes('maplibre-gl')) {
          entry.prefetch = false
          entry.preload = false
        }
      }
    },
  },

  nitro: {
    // Статика принудительно, а не только по команде `nuxt generate`.
    //
    // ЗАЧЕМ. Хостинг сам решает, чем собирать проект, и в панели App Platform
    // стоит `npm run build`. Без этой строки `nuxt build` собирал бы серверное
    // приложение, а раздаётся на площадке только папка — поэтому сайт и
    // работал «наполовину»: страницы были (их всё равно пререндерит
    // prerender ниже), а карты сайта и страницы 404 не было.
    //
    // С `preset: 'static'` обе команды дают один и тот же результат в
    // `.output/public`, и ошибиться командой в панели больше нельзя.
    // Шаги после сборки прицеплены к npm — см. postbuild/postgenerate
    // в package.json, их npm выполняет сам при любом из двух вызовов.
    preset: 'static',

    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog', '/privacy-policy', '/404'],
      failOnError: false,
    },
  },

  experimental: { payloadExtraction: true },

  // Оформление — отдельным файлом, а не внутри каждой страницы.
  // По умолчанию Nuxt вшивает стили маршрута в HTML: это экономит один
  // запрос при первом заходе, но дальше те же 45 КБ скачиваются заново
  // на каждой странице. Ровно эту беду ТЗ и просит убрать у Тильды.
  features: { inlineStyles: false },
})
