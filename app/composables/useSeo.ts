import { COMPANY } from '~/data/site'

export interface SeoInput {
  title: string
  description: string
  /** Имя картинки из манифеста для превью в мессенджерах. */
  image?: string
  /** Для статей: 'article' вместо 'website'. */
  type?: 'website' | 'article'
  noindex?: boolean
}

/**
 * Единая установка мета-тегов страницы.
 *
 * На текущем сайте заголовок главной — слово «Главная», описания нет ни на
 * одной странице, canonical указывает на http-версию, а og:description пуст.
 * Здесь всё это задаётся из одного места и не может «забыться».
 */
export function useSeo(input: SeoInput) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const base = (config.public.siteUrl as string).replace(/\/$/, '')

  // Адреса приводим к виду СО слешем на конце.
  //
  // Это не вкусовое решение, а подстройка под хостинг: App Platform отдаёт
  // страницы из папок (`/contacts/index.html`), и его веб-сервер сам
  // переадресует `/contacts` на `/contacts/` кодом 308. Своей конфигурации
  // веб-сервера на этом хостинге нет, поменять поведение нельзя.
  //
  // Пока canonical указывал на адрес без слеша, он указывал на адрес, который
  // сам же переадресует: поисковик получал противоречивый сигнал, а каждый
  // переход по меню стоил посетителю лишнего обращения к серверу.
  const canonical = computed(() =>
    `${base}${route.path === '/' ? '/' : route.path.replace(/\/?$/, '/')}`,
  )

  // Превью для мессенджеров. Адрес абсолютный — относительный они не
  // разворачивают, а формат JPEG, потому что WebP понимают не все клиенты.
  // По умолчанию — отдельная обложка 1200×630; у статьи своя фотография.
  const ogName = computed(() => input.image ?? 'og-cover')
  const ogImage = computed(() => `${base}/images/${ogName.value}.jpg`)
  const ogSize = computed(() => {
    const m = useImage(ogName.value)
    return { w: String(m.w || 1200), h: String(m.h || 630) }
  })

  const fullTitle = computed(() =>
    input.title.includes(COMPANY.name) ? input.title : `${input.title} | ${COMPANY.name}`,
  )

  useHead({
    title: fullTitle,
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: input.description },
      ...(input.noindex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
    ],
  })

  useSeoMeta({
    ogTitle: fullTitle,
    ogDescription: input.description,
    ogType: input.type ?? 'website',
    ogUrl: canonical,
    ogImage,
    ogSiteName: COMPANY.name,
    ogLocale: 'ru_RU',
    twitterCard: 'summary_large_image',
    ogImageWidth: ogSize.value.w,
    ogImageHeight: ogSize.value.h,
    twitterTitle: fullTitle,
    twitterDescription: input.description,
    twitterImage: ogImage,
  })
}
