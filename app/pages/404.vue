<script setup lang="ts">

useSeo({
  title: 'Страница не найдена',
  description: 'Такой страницы на сайте нет. Вернитесь на главную или посмотрите проекты из клееного бруса.',
  noindex: true,
})
</script>

<template>
  <LayoutNotFound :code="404" />
</template>
