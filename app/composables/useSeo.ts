import { COMPANY } from '~/data/site'

export interface SeoInput {
  title: string
  description: string

  image?: string

  type?: 'website' | 'article'
  noindex?: boolean
}

export function useSeo(input: SeoInput) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const base = (config.public.siteUrl as string).replace(/\/$/, '')

  const canonical = computed(() =>
    `${base}${route.path === '/' ? '/' : route.path.replace(/\/?$/, '/')}`,
  )

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
