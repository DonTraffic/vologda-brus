<script setup lang="ts">
import { MESSENGERS } from '~/data/site'
import { POPUP } from '~/data/content'

const { isOpen, close } = useMessengerModal()
const dialog = ref<HTMLElement | null>(null)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(isOpen, async (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    // Переводим фокус внутрь окна, иначе с клавиатуры в него не попасть
    dialog.value?.querySelector<HTMLElement>('a, button')?.focus()
  }
})

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal">
        <div class="modal__backdrop" @click="close" />

        <div ref="dialog" class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <p class="modal__kicker">{{ POPUP.kicker }}</p>
          <h2 id="modal-title" class="modal__title">{{ POPUP.title }}</h2>
          <p class="modal__subtitle">{{ POPUP.subtitle }}</p>

          <ul class="modal__list" role="list">
            <li v-for="m in MESSENGERS" :key="m.id">
              <a :href="m.href" class="modal__link" target="_blank" rel="noopener noreferrer">
                <IconChat name="chat" :size="22" />
                <span>{{ m.label }}</span>
              </a>
            </li>
          </ul>

          <p class="modal__note">{{ POPUP.note }}</p>

          <button type="button" class="modal__close" @click="close">
            <IconChat name="close" :size="20" />
            <span class="visually-hidden">Закрыть</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  padding: $gutter;

  &__backdrop { position: absolute; inset: 0; background: rgba($c-brown-900, 0.72); }

  &__dialog {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    padding: clamp($space-lg, 5vw, $space-xl);
    text-align: center;
    background: $c-cream;
    border-radius: $radius-lg;
    box-shadow: $shadow-lg;
  }

  &__kicker {
    font-size: $fs-xs;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $c-accent-hover;
  }

  &__title { margin: $space-xs 0 $space-sm; font-size: $fs-h3; }

  &__subtitle { font-size: $fs-small; color: $c-text-muted; }

  &__list {
    display: grid;
    gap: $space-xs;
    margin: $space-lg 0 $space-md;
    list-style: none;
    padding: 0;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-xs;
    padding: 16px;
    font-weight: $fw-semibold;
    color: $c-white;
    background: $c-green-800;
    border-radius: $radius-sm;
    transition: background-color $transition;
    @include focus-ring;

    &:hover { background: $c-green-900; }
  }

  &__note { font-size: $fs-xs; color: $c-text-muted; }

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    color: $c-text-muted;
    border-radius: 50%;
    @include focus-ring;

    &:hover { background: rgba($c-brown-900, 0.07); color: $c-text; }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity $transition; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
