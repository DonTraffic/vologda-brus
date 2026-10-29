<script setup lang="ts">

const props = withDefaults(defineProps<{
  name: string
  alt: string

  sizes?: string

  priority?: boolean

  cover?: boolean
}>(), {
  sizes: '100vw',
  priority: false,
  cover: false,
})

const img = computed(() => useImage(props.name))
</script>

<template>
  <img
    v-if="img.isSvg"
    :src="img.src"
    :alt="alt"
    :loading="priority ? 'eager' : 'lazy'"
    :decoding="priority ? 'sync' : 'async'"
    class="smart-image"
    :class="{ 'smart-image--cover': cover }"
  >
  <picture v-else-if="img.src">
    <source type="image/webp" :srcset="img.srcset" :sizes="sizes">
    <img
      :src="img.src"
      :alt="alt"
      :width="img.w || undefined"
      :height="img.h || undefined"
      :loading="priority ? 'eager' : 'lazy'"
      :decoding="priority ? 'sync' : 'async'"
      :fetchpriority="priority ? 'high' : undefined"
      class="smart-image"
      :class="{ 'smart-image--cover': cover }"
    >
  </picture>
</template>

<style scoped lang="scss">
.smart-image {
  width: 100%;
  height: auto;

  &--cover {
    height: 100%;
    object-fit: cover;
  }
}
</style>
