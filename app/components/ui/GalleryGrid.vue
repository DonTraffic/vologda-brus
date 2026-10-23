<script setup lang="ts">
/**
 * Сетка фотографий с увеличением по клику.
 *
 * Плитки — настоящие <button>, поэтому доступны с клавиатуры. Без JavaScript
 * остаётся обычная сетка картинок: содержимое не пропадает.
 */
const props = withDefaults(defineProps<{
  items: string[]
  /** Подпись-основа для alt: к ней добавляется номер кадра. */
  altBase: string
  minTile?: string
}>(), {
  minTile: '260px',
})

const activeIndex = ref<number | null>(null)
const isOpen = computed(() => activeIndex.value !== null)

function openAt(i: number) { activeIndex.value = i }
function close() { activeIndex.value = null }

function step(delta: number) {
  if (activeIndex.value === null) return
  const n = props.items.length
  activeIndex.value = (activeIndex.value + delta + n) % n
}

function onKey(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

// Пока открыт просмотр — страница под ним не прокручивается
watch(isOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})

const altFor = (i: number) => `${props.altBase} — фото ${i + 1} из ${props.items.length}`
</script>

<template>
  <div class="gallery">
    <ul class="gallery__grid" role="list" :style="{ '--min-tile': minTile }">
      <li v-for="(name, i) in items" :key="name" class="gallery__item">
        <button type="button" class="gallery__tile" @click="openAt(i)">
          <SmartImage
            :name="name"
            :alt="altFor(i)"
            cover
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <span class="visually-hidden">Открыть фото {{ i + 1 }} крупнее</span>
        </button>
      </li>
    </ul>

    <Teleport v-if="isOpen" to="body">
      <div
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="`Просмотр фото ${(activeIndex ?? 0) + 1} из ${items.length}`"
      >
        <div class="lightbox__backdrop" @click="close" />

        <figure class="lightbox__figure">
          <SmartImage
            :name="items[activeIndex!]!"
            :alt="altFor(activeIndex!)"
            priority
            sizes="90vw"
          />
          <figcaption class="lightbox__caption">
            {{ (activeIndex ?? 0) + 1 }} / {{ items.length }}
          </figcaption>
        </figure>

        <button type="button" class="lightbox__btn lightbox__btn--close" @click="close">
          <span aria-hidden="true">✕</span>
          <span class="visually-hidden">Закрыть просмотр</span>
        </button>
        <button v-if="items.length > 1" type="button" class="lightbox__btn lightbox__btn--prev" @click="step(-1)">
          <span aria-hidden="true">‹</span>
          <span class="visually-hidden">Предыдущее фото</span>
        </button>
        <button v-if="items.length > 1" type="button" class="lightbox__btn lightbox__btn--next" @click="step(1)">
          <span aria-hidden="true">›</span>
          <span class="visually-hidden">Следующее фото</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  &__grid {
    display: grid;
    gap: $space-sm;
    grid-template-columns: repeat(auto-fill, minmax(min(var(--min-tile, 260px), 100%), 1fr));
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item { margin: 0; }

  &__tile {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: $radius-md;
    background: $c-sand;
    cursor: zoom-in;
    @include focus-ring;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }

    &:hover :deep(img) { transform: scale(1.04); }
  }
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: clamp($space-sm, 4vw, $space-xl);

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba($c-brown-900, 0.92);
  }

  &__figure {
    position: relative;
    z-index: 1;
    margin: 0;
    max-width: min(1100px, 92vw);

    :deep(img) {
      max-height: 82vh;
      width: auto;
      max-width: 100%;
      margin-inline: auto;
      border-radius: $radius-md;
    }
  }

  &__caption {
    margin-top: $space-sm;
    text-align: center;
    font-size: $fs-small;
    color: rgba($c-white, 0.7);
  }

  &__btn {
    position: absolute;
    z-index: 2;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    font-size: 28px;
    line-height: 1;
    color: $c-white;
    background: rgba($c-white, 0.12);
    border-radius: 50%;
    transition: background-color $transition;
    @include focus-ring($c-white);

    &:hover { background: rgba($c-white, 0.26); }

    &--close { top: clamp($space-sm, 3vw, $space-lg); right: clamp($space-sm, 3vw, $space-lg); font-size: 20px; }
    &--prev { left: clamp($space-xs, 2vw, $space-md); top: 50%; transform: translateY(-50%); }
    &--next { right: clamp($space-xs, 2vw, $space-md); top: 50%; transform: translateY(-50%); }
  }
}
</style>
