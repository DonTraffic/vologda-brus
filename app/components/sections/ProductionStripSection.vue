<script setup lang="ts">
import { PRODUCTION_STRIP, type StripItem } from '~/data/content'
import imagesManifest from '~/data/images.json'

const images = (imagesManifest as { default?: Record<string, { w: number; h: number }> }).default
  ?? (imagesManifest as Record<string, { w: number; h: number }>)

const widthOf = (name: string) => {
  const m = images[name]
  return m && m.h ? Math.round((m.w / m.h) * 500) : 667
}

const label = (item: StripItem, i: number) =>
  item.type === 'video'
    ? `Производство клееного бруса в Вологде — видео ${i + 1}`
    : `Производство клееного бруса в Вологде — кадр ${i + 1}`

const { el: strip, scrollByCards } = useCarousel({ interval: 5000, gap: 20 })
const lightbox = ref<{ open: (i: number) => void } | null>(null)

function show(i: number) {
  strip.value?.querySelectorAll('video').forEach(v => v.pause())
  lightbox.value?.open(i)
}

onMounted(() => {
  const node = strip.value
  if (!node || !('IntersectionObserver' in window)) return

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const video = e.target as HTMLVideoElement
      if (e.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }
  }, { threshold: 0.5 })

  node.querySelectorAll('video').forEach(v => io.observe(v))
  onBeforeUnmount(() => io.disconnect())
})
</script>

<template>
  <section class="ps" aria-label="Производство изнутри">
    <ul ref="strip" class="ps__strip" role="list">
      <li
        v-for="(item, i) in PRODUCTION_STRIP.items"
        :key="item.name"
        class="ps__item"
        :style="`--w: ${widthOf(item.name)}px`"
      >
        <button type="button" class="ps__open" :aria-label="`Открыть: ${label(item, i)}`" @click="show(i)">
          <video
            v-if="item.type === 'video'"
            class="ps__video"
            :src="`/videos/${item.name}.mp4`"
            :poster="`/images/${item.name}-640.webp`"
            muted
            loop
            playsinline
            preload="none"
          />

          <SmartImage
            v-else
            :name="item.name"
            :alt="label(item, i)"
            cover
            sizes="(min-width: 1201px) 667px, 70vw"
          />

          <span v-if="item.type === 'video'" class="ps__play" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
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

    <MediaLightbox ref="lightbox" :items="PRODUCTION_STRIP.items" :label="label" />
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
  }

  &__open {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    cursor: zoom-in;
    @include focus-ring($c-tan-500);

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
  }

  &__video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    background: $c-sand;
  }

  &__play {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    padding-left: 2px;
    color: $c-green-900;
    background: rgba($c-tan-500, 0.92);
    border-radius: 50%;
    pointer-events: none;
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
