<script setup lang="ts">
// Там, где страница начинается с фотографии на всю ширину, шапка лежит
// поверх неё — как в оригинале. Остальным страницам нужен отступ сверху
// на высоту шапки.
const COVER_PAGES = ['/', '/blog']
const route = useRoute()
const isHome = computed(() => COVER_PAGES.includes(route.path))
</script>

<template>
  <div class="layout" :class="{ 'layout--offset': !isHome }">
    <a class="skip-link" href="#main">Перейти к содержанию</a>

    <LayoutSiteHeader />

    <main id="main" class="layout__main">
      <slot />
    </main>

    <LayoutContactsMap />

    <LayoutSiteFooter />

    <LayoutMessengerModal />
    <LayoutCookieBanner />
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  // Блоки приезжают из-за края экрана, и на время анимации они вылезают
  // за пределы страницы. clip отрезает их, не делая сам слой прокручиваемым.
  overflow-x: clip;

  &__main { flex: 1; }

  &--offset &__main { padding-top: var(--hdr-h, 56px); }
}
</style>
