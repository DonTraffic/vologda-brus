<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  kicker?: string
  subtitle?: string
  /** Уровень заголовка. На странице должен быть ровно один h1. */
  level?: 2 | 3
  align?: 'left' | 'center'
  invert?: boolean
}>(), {
  level: 2,
  align: 'left',
  invert: false,
})
</script>

<template>
  <header class="section-header" :class="[`section-header--${align}`, { 'section-header--invert': invert }]">
    <p v-if="kicker" class="section-header__kicker">{{ kicker }}</p>
    <component :is="`h${level}`" class="section-header__title">{{ title }}</component>
    <p v-if="subtitle" class="section-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped lang="scss">
.section-header {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  margin-bottom: clamp($space-md, 3vw, $space-xl);

  &--center { align-items: center; text-align: center; }

  &__kicker {
    font-size: $fs-xs;
    font-weight: $fw-semibold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $c-accent;
  }

  &__title { margin: 0; }

  &__subtitle {
    max-width: 62ch;
    font-size: $fs-lead;
    color: $c-text-muted;
  }

  &--invert {
    .section-header__title { color: $c-white; }
    .section-header__subtitle { color: rgba($c-white, 0.78); }
    .section-header__kicker { color: $c-mint-300; }
  }
}
</style>
