<script setup lang="ts">
/**
 * Кнопка или ссылка одним компонентом.
 *
 * Если передан to/href — получается настоящая ссылка, которую можно открыть
 * в новой вкладке и которую видит поисковик. Внешние ссылки автоматически
 * получают rel="noopener noreferrer": на текущем сайте ссылки на мессенджеры
 * открываются в новой вкладке без этой защиты.
 */
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'ghost' | 'light'
  size?: 'md' | 'lg'
  block?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  block: false,
})

const target = computed(() => props.to || props.href || '')
const isExternal = computed(() => /^(https?:)?\/\//.test(target.value) || /^(tel|mailto):/.test(target.value))
const isInternalRoute = computed(() => !!target.value && !isExternal.value)

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  { 'btn--block': props.block },
])
</script>

<template>
  <NuxtLink v-if="isInternalRoute" :to="target" :class="classes">
    <slot />
  </NuxtLink>
  <a
    v-else-if="target"
    :href="target"
    :class="classes"
    :target="isExternal && !/^(tel|mailto):/.test(target) ? '_blank' : undefined"
    :rel="isExternal && !/^(tel|mailto):/.test(target) ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </a>
  <button v-else :type="type" :class="classes">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-xs;
  text-align: center;
  font-weight: $fw-semibold;
  line-height: 1.2;
  border-radius: $radius-sm;
  transition: background-color $transition, color $transition, border-color $transition, transform $transition;
  @include focus-ring;

  &--md { padding: 14px 26px; font-size: $fs-small; }
  &--lg { padding: 18px 34px; font-size: $fs-body; }
  &--block { width: 100%; }

  &--primary {
    background: $c-accent;
    color: $c-white;

    &:hover { background: $c-accent-hover; }
  }

  &--secondary {
    background: $c-green-800;
    color: $c-white;

    &:hover { background: $c-green-900; }
  }

  &--ghost {
    border: 1px solid currentcolor;
    color: $c-brown-700;

    &:hover { background: $c-brown-700; color: $c-white; border-color: $c-brown-700; }
  }

  &--light {
    background: $c-white;
    color: $c-green-800;

    &:hover { background: $c-mint-100; }
  }

  &:active { transform: translateY(1px); }
}
</style>
