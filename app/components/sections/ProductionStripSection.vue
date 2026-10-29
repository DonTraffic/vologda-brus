<script setup lang="ts">
import { PRODUCTION_STRIP } from '~/data/content'
import imagesManifest from '~/data/images.json'

const images = (imagesManifest as { default?: Record<string, { w: number; h: number }> }).default
  ?? (imagesManifest as Record<string, { w: number; h: number }>)

const widthOf = (name: string) => {
  const m = images[name]
  return m && m.h ? Math.round((m.w / m.h) * 500) : 667
}

const { el: strip, scrollByCards } = useCarousel({ interval: 5000, gap: 20 })
</script>

<template>
  <section class="ps" aria-label="Производство изнутри">
    <ul ref="strip" class="ps__strip" role="list">
      <li
        v-for="(name, i) in PRODUCTION_STRIP.items"
        :key="name"
        class="ps__item"
        :style="`--w: ${widthOf(name)}px`"
      >
        <SmartImage
          :name="name"
          :alt="`Производство клееного бруса в Вологде — кадр ${i + 1}`"
          cover
          sizes="(min-width: 1201px) 667px, 70vw"
        />
      </li>
    </ul>

    <div class="ps__controls">
      <button type="button" class="ps__btn" aria-label="Предыдущие снимки" @click="scrollByCards(-1)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M15 5 8 12l7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button type="button" class="ps__btn" aria-label="Следующие снимки" @click="scrollByCards(1)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">

.ps {
  position: relative;
  padding-bottom: 30px;
  background: $c-white;

  &__strip {
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0 $gutter;
    overflow-x: auto;
    list-style: none;
    user-select: none;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }

    @media (min-width: #{$t-bp-lg}) { padding-inline: calc((100vw - 960px) / 2 + 20px); }
    @media (min-width: #{$t-bp-xl}) { padding-inline: calc((100vw - 1200px) / 2 + 20px); }
  }

  &__item {
    flex: 0 0 auto;
    width: 70vw;
    height: 320px;
    overflow: hidden;
    background: $c-sand;

    @media (min-width: #{$t-bp-lg}) { width: var(--w); height: 500px; }

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
  }

  &__controls {
    position: absolute;
    inset: 0 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: 44px;
    pointer-events: none;
  }

  &__btn {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    color: $c-white;
    pointer-events: auto;
    background: $c-tan-500;
    border-radius: 50%;
    transition: background-color $transition;
    @include focus-ring;

    &:hover { background: $c-brown-500; }
  }
}
</style>
