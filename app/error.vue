<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * Ошибки, пойманные уже в браузере. Настоящая страница «не найдено»
 * собирается заранее — app/pages/404.vue, — чтобы поисковик и человек
 * без скриптов видели готовую разметку, а не пустую оболочку.
 */
const props = defineProps<{ error: NuxtError }>()

const code = computed(() => props.error?.statusCode ?? 500)

useHead({
  title: computed(() => (code.value === 404 ? 'Страница не найдена' : 'Ошибка')),
  meta: [{ name: 'robots', content: 'noindex, follow' }],
})
</script>

<template>
  <NuxtLayout>
    <LayoutNotFound :code="code" />
  </NuxtLayout>
</template>
