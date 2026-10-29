import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://vologda-brus.ru'

export default defineNuxtConfig({
  compatibilityDate: '2025-10-01',
  devtools: { enabled: true },

  ssr: true,

  css: ['~/assets/scss/main.scss'],

  components: [
    { path: '~/components/ui', pathPrefix: false },
    '~/components',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
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

        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  runtimeConfig: {
    smtpHost: 'smtp.timeweb.ru',
    smtpPort: '465',
    smtpUser: '',
    smtpPass: '',
    mailTo: '',

    public: {
      siteUrl: SITE_URL,
      formEndpoint: '/api/lead',
      metrikaId: '',
      gaId: '',
      yandexVerification: '',
      googleVerification: '',
    },
  },

  hooks: {
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
    preset: 'node-server',

    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog', '/privacy-policy', '/404', '/sitemap.xml'],
      failOnError: false,
    },
  },

  experimental: { payloadExtraction: true },

  features: { inlineStyles: false },
})
