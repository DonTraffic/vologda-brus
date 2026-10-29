<script setup lang="ts">

const props = defineProps<{

  images: readonly string[]

  index: number

  caption: string
}>()

const emit = defineEmits<{ close: []; 'update:index': [value: number] }>()

const isOpen = computed(() => props.index >= 0 && props.index < props.images.length)
const dialog = ref<HTMLElement | null>(null)

let opener: HTMLElement | null = null

function step(delta: number) {
  const n = props.images.length
  if (!n) return
  emit('update:index', (props.index + delta + n) % n)
}

function onKey(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') { e.preventDefault(); emit('close') }
  else if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
}

watch(isOpen, (open, was) => {
  if (!import.meta.client) return

  if (open) {
    opener = document.activeElement as HTMLElement | null

    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    nextTick(() => dialog.value?.focus())
  }
  else if (was) {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
    opener?.focus?.()
    opener = null
  }
})

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
})
</script>

<template>
  <Transition name="lb">
    <div
      v-if="isOpen"
      ref="dialog"
      class="lb"
      role="dialog"
      aria-modal="true"
      :aria-label="`${caption} — фото ${index + 1} из ${images.length}`"
      tabindex="-1"
      @click.self="emit('close')"
    >
      <button type="button" class="lb__close" aria-label="Закрыть" @click="emit('close')">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m5 5 14 14M19 5 5 19" stroke-linecap="round" />
        </svg>
      </button>

      <button
        v-if="images.length > 1" type="button"
        class="lb__nav lb__nav--prev" aria-label="Предыдущее фото" @click="step(-1)"
      >
        <svg viewBox="0 0 17 28" width="17" height="28" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M15 2 3 14l12 12" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <figure class="lb__figure">
        <SmartImage
          :key="images[index]"
          :name="images[index]!"
          :alt="`${caption} — фото ${index + 1}`"
          priority
          sizes="100vw"
        />
        <figcaption v-if="images.length > 1" class="lb__counter">
          {{ index + 1 }} / {{ images.length }}
        </figcaption>
      </figure>

      <button
        v-if="images.length > 1" type="button"
        class="lb__nav lb__nav--next" aria-label="Следующее фото" @click="step(1)"
      >
        <svg viewBox="0 0 17 28" width="17" height="28" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m2 2 12 12L2 26" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.lb {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(4px, 1.5vw, 20px);
  padding: clamp(12px, 3vw, 40px);
  background: rgba(#000, 0.92);

  &__figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 0;
    min-width: 0;

    :deep(picture) { display: block; max-width: 100%; }

    :deep(img) {
      display: block;
      width: auto;
      height: auto;
      max-width: 100%;

      max-height: calc(100dvh - clamp(80px, 14vw, 150px));
      object-fit: contain;
    }
  }

  &__counter {
    font-size: 14px;
    color: rgba($c-white, 0.75);
    font-variant-numeric: tabular-nums;
  }

  &__close {
    position: absolute;
    top: clamp(8px, 2vw, 24px);
    right: clamp(8px, 2vw, 24px);
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    color: $c-white;
    background: rgba($c-white, 0.1);
    transition: background-color $transition;
    @include focus-ring($c-mint-300);

    &:hover { background: rgba($c-white, 0.22); }
  }

  &__nav {
    display: grid;
    place-items: center;
    width: clamp(36px, 6vw, 56px);
    height: clamp(56px, 9vw, 80px);
    color: $c-white;
    background: rgba($c-white, 0.1);
    transition: background-color $transition;
    @include focus-ring($c-mint-300);

    &:hover { background: rgba($c-white, 0.22); }
  }
}

.lb-enter-active, .lb-leave-active { transition: opacity 0.2s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .lb-enter-active, .lb-leave-active { transition: none; }
}
</style>
