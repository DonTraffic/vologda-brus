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
      // Пока пусто — форма честно сообщает, что приём не настроен,
      // вместо того чтобы молча терять заявки.
      formEndpoint: '',
    },
  },

  nitro: {
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
