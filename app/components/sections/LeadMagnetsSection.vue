<script setup lang="ts">
import { LEAD_MAGNETS } from '~/data/content'
const { open: openMessengers } = useMessengerModal()

const SLOT = ['check', 'bath', 'house'] as const
</script>

<template>
  <ZeroStage :height="750" bg="#ffffff" scale>
    <h2 class="lm__title">{{ LEAD_MAGNETS.title }}</h2>

    <div
      v-for="(item, i) in LEAD_MAGNETS.items" :key="item.title"
      class="lm__item" :class="`lm__item--${SLOT[i]}`"
    >
      <div class="lm__thumb">
        <SmartImage :name="item.image" :alt="item.title" cover sizes="(min-width: 1024px) 560px, 100vw" />
      </div>
      <h3 class="lm__name">{{ item.title }}</h3>

      <a href="#consult" class="lm__get" @click.prevent="openMessengers()">{{ LEAD_MAGNETS.cta }}</a>
    </div>
  </ZeroStage>
</template>

<style scoped lang="scss">
.lm {
  &__title { font-size: 36px; font-weight: $fw-semibold; line-height: 45px; margin-bottom: $space-lg; }

  &__item { margin-bottom: $space-lg; }

  &__thumb {
    overflow: hidden;
    background: $c-sand;
    aspect-ratio: 3 / 2;
    margin-bottom: $space-sm;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__name { font-size: 24px; font-weight: $fw-regular; line-height: 32.4px; margin-bottom: $space-xs; }

  &__get {

    display: inline-block;
    text-align: center;
    font-size: 16px;
    font-weight: $fw-medium;
    line-height: 24.8px;
    color: inherit;
    border-bottom: 1px solid $c-brown-500;
    @include focus-ring;

    &:hover { color: $c-brown-500; }
  }

  @include up(lg) {
    &__title { @include place((x: 120px, y: 76px, w: 753px, h: 45px)); margin: 0; }

    &__item { display: contents; }

    &__thumb { position: absolute; margin: 0; aspect-ratio: auto; }
    &__name  { position: absolute; margin: 0; }
    &__get   { position: absolute; }

    &__item--house {
      .lm__thumb { left: 20px;  top: 169px; width: 560px; height: 373px; }
      .lm__name  { left: 20px;  top: 567px; width: 560px; }
      .lm__get   { left: 20px;  top: 639px; }
    }

    &__item--bath {
      .lm__thumb { left: 620px; top: 169px; width: 268px; height: 229px; }
      .lm__name  { left: 913px; top: 169px; width: 268px; }
      .lm__get   { left: 913px; top: 370px; }
    }
    &__item--check {
      .lm__thumb { left: 620px; top: 438px; width: 268px; height: 229px; }
      .lm__name  { left: 913px; top: 438px; width: 268px; }
      .lm__get   { left: 913px; top: 639px; }
    }
  }
}
</style>
