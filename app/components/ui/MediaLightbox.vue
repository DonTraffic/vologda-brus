<script setup lang="ts">
import type { StripItem } from '~/data/content'

const props = defineProps<{ items: StripItem[]; label: (item: StripItem, i: number) => string }>()

const index = ref(-1)
const isOpen = computed(() => index.value >= 0)
const current = computed(() => (isOpen.value ? props.items[index.value] : null))
const picture = computed(() => (current.value ? useImage(current.value.name) : null))

function open(i: number) { index.value = i }
function close() { index.value = -1 }

function go(step: number) {
  const total = props.items.length
  if (!total) return
  index.value = (index.value + step + total) % total
}

function onKey(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') go(-1)
  else if (e.key === 'ArrowRight') go(1)
}

watch(isOpen, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})

defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <Transition name="lb">
      <div v-if="current" class="lb" role="dialog" aria-modal="true" aria-label="Просмотр кадра">
        <div class="lb__backdrop" @click="close" />

        <div class="lb__stage">
          <video
            v-if="current.type === 'video'"
            :key="current.name"
            class="lb__media"
            :src="`/videos/${current.name}.mp4`"
            :poster="picture?.src"
            controls
            autoplay
            playsinline
            preload="auto"
          />

          <picture v-else-if="picture" :key="current.name">
            <source type="image/webp" :srcset="picture.srcset" sizes="100vw">
            <img class="lb__media" :src="picture.src" :alt="label(current, index)">
          </picture>
        </div>

        <p class="lb__count">{{ index + 1 }} из {{ items.length }}</p>

        <button type="button" class="lb__nav lb__nav--prev" aria-label="Предыдущий кадр" @click="go(-1)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M15 5 8 12l7 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <button type="button" class="lb__nav lb__nav--next" aria-label="Следующий кадр" @click="go(1)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <button type="button" class="lb__close" aria-label="Закрыть просмотр" @click="close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.lb {
  position: fixed;
  inset: 0;
  z-index: 160;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  padding: clamp(12px, 4vw, 48px);
  padding-bottom: 46px;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba($c-green-900, 0.97);
  }

  &__stage {
    position: relative;
    display: grid;
    place-items: center;
    min-width: 0;
    min-height: 0;
    pointer-events: none;

    picture { display: contents; }
  }

  &__media {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    object-fit: contain;
  }

  video#{&}__media { pointer-events: auto; }

  &__count {
    position: absolute;
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
    margin: 0;
    font-size: 13px;
    color: rgba($c-white, 0.7);
  }

  &__nav,
  &__close {
    position: absolute;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    color: $c-green-900;
    background: $c-tan-500;
    border-radius: 50%;
    transition: background-color $transition;
    @include focus-ring($c-mint-300);

    &:hover { background: $c-white; }
  }

  &__nav {
    top: 50%;
    transform: translateY(-50%);

    &--prev { left: clamp(8px, 2vw, 28px); }
    &--next { right: clamp(8px, 2vw, 28px); }
  }

  &__close {
    top: clamp(8px, 2vw, 28px);
    right: clamp(8px, 2vw, 28px);
  }
}

.lb-enter-active,
.lb-leave-active { transition: opacity $transition; }

.lb-enter-from,
.lb-leave-to { opacity: 0; }
</style>
