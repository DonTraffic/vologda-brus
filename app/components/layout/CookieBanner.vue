<script setup lang="ts">
import { COOKIE } from '~/data/content'

const STORAGE_KEY = 'vb-cookie-ack'
const isVisible = ref(false)

onMounted(() => {
  try {
    isVisible.value = localStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    // Приватный режим или заблокированное хранилище — баннер просто не покажем
    isVisible.value = false
  }
})

function accept() {
  isVisible.value = false
  try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* не критично */ }
}
</script>

<template>
  <Transition name="rise">
    <aside v-if="isVisible" class="cookie" aria-label="Уведомление о cookies">
      <p class="cookie__text">
        {{ COOKIE.text }}
        <NuxtLink to="/privacy-policy/" class="cookie__link">Политика конфиденциальности</NuxtLink>
      </p>
      <BaseButton variant="light" size="md" @click="accept">{{ COOKIE.accept }}</BaseButton>
    </aside>
  </Transition>
</template>

<style scoped lang="scss">
.cookie {
  position: fixed;
  bottom: $space-sm;
  left: 50%;
  transform: translateX(-50%);
  z-index: 150;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-sm $space-md;
  width: calc(100% - #{$gutter * 2});
  max-width: 820px;
  padding: $space-sm $space-md;
  background: $c-green-800;
  color: rgba($c-white, 0.9);
  border-radius: $radius-md;
  box-shadow: $shadow-lg;

  &__text { flex: 1 1 280px; font-size: $fs-xs; line-height: 1.6; }

  &__link {
    color: $c-mint-300;
    text-decoration: underline;
    text-underline-offset: 2px;
    @include focus-ring($c-mint-300);
  }
}

.rise-enter-active, .rise-leave-active { transition: opacity $transition, transform $transition; }
.rise-enter-from, .rise-leave-to { opacity: 0; transform: translate(-50%, 12px); }
</style>
