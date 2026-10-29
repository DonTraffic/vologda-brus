<script setup lang="ts">

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

  overflow-x: clip;

  &__main { flex: 1; }

  &--offset &__main { padding-top: var(--hdr-h, 56px); }
}
</style>
