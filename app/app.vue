<script setup lang="ts">
import { COMPANY, PHONE_HREF, EMAIL, ADDRESS, WORK_HOURS, LEGAL, SOCIAL } from '~/data/site'

const config = useRuntimeConfig()
const base = (config.public.siteUrl as string).replace(/\/$/, '')

const organisation = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${base}/#organization`,
  name: COMPANY.name,
  description: COMPANY.tagline,
  url: base,
  telephone: PHONE_HREF,
  email: EMAIL,
  foundingDate: String(COMPANY.foundedYear),
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
    addressLocality: ADDRESS.city,
    streetAddress: ADDRESS.street,
    ...(ADDRESS.postalCode ? { postalCode: ADDRESS.postalCode } : {}),
  },
  ...(ADDRESS.lat && ADDRESS.lon
    ? { geo: { '@type': 'GeoCoordinates', latitude: ADDRESS.lat, longitude: ADDRESS.lon } }
    : {}),
  openingHours: WORK_HOURS.schemaOrg,
  image: `${base}/images/hero-01-1600.webp`,
  sameAs: SOCIAL.map(s => s.href),
  legalName: LEGAL.name,
  taxID: LEGAL.inn,

  ...(LEGAL.ogrnip ? { identifier: LEGAL.ogrnip } : {}),
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(organisation.value)),
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
