<script setup lang="ts">
import { HERO, HERO_STATS } from '~/data/content'
const { open: openMessengers } = useMessengerModal()
</script>

<template>
  <section class="hero">

    <div class="hero__bg">
      <SmartImage name="hero-01" alt="" priority cover sizes="100vw" />
    </div>

    <div class="hero__stage">
      <h1 class="hero__title">
        <span v-for="l in HERO.titleLines" :key="l">{{ l }}</span>
      </h1>

      <p class="hero__lead">{{ HERO.lead }}</p>

      <a href="#calc" class="hero__btn hero__btn--outline" @click.prevent="openMessengers()">
        {{ HERO.primaryCta }}
      </a>
      <a href="#calc" class="hero__btn hero__btn--solid" @click.prevent="openMessengers()">
        {{ HERO.secondaryCta }}
      </a>

      <div class="hero__inset">
        <BeforeAfter
          :before="HERO.beforeAfter.before"
          :after="HERO.beforeAfter.after"
          :label-before="HERO.beforeAfter.labelBefore"
          :label-after="HERO.beforeAfter.labelAfter"
        />
      </div>

      <div class="hero__box hero__box--feature" aria-hidden="true" />
      <div v-for="(s, i) in HERO_STATS.items" :key="`b${i}`"
           class="hero__box" :class="`hero__box--${i + 1}`" aria-hidden="true" />

      <p class="hero__label hero__label--feature">
        <span>{{ HERO_STATS.feature.value }}</span>
        <span>{{ HERO_STATS.feature.label }}</span>
      </p>
      <p v-for="(s, i) in HERO_STATS.items" :key="s.label"
         class="hero__label" :class="`hero__label--${i + 1}`">
        <span>{{ s.value }}</span>
        <span>{{ s.label }}</span>
      </p>

      <a href="#experts" class="hero__scroll" aria-label="К следующему разделу">
        <svg viewBox="0 0 39 20" width="39" height="20" fill="none" aria-hidden="true">
          <path d="M2 2 19.5 17 37 2" stroke="currentColor" stroke-width="2" />
        </svg>
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use 'sass:list';

.hero {
  position: relative;
  isolation: isolate;
  color: $c-white;
  background: $c-green-900;

  --k: tan(atan2(100vw, #{$stage-w}));
  min-height: calc(#{$stage-h} * var(--k, 1));
  height: 100vh;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: -1;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; object-position: center; }
  }

  &__stage {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-sm;
    width: min(#{$stage-w}, 100%);
    margin-inline: auto;
    padding: $space-xl $gutter $space-2xl;
  }

  &__title {
    display: flex;
    flex-direction: column;
    margin: 0;
    color: $c-white;
    font-weight: $fw-semibold;
    line-height: 1;
    letter-spacing: $hero-title-ls;
    font-size: clamp(2.75rem, 1.6rem + 5.2vw, #{$hero-title-fs});
  }

  &__lead {
    max-width: 44ch;
    font-size: clamp(1rem, 0.95rem + 0.25vw, 20px);
    font-weight: $fw-regular;
    line-height: 1.55;
    color: $c-white;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 18px;
    font-size: 14px;
    font-weight: $fw-semibold;
    line-height: 1.2;
    text-align: center;
    color: $c-white;
    border: 2px solid transparent;
    border-radius: 1px;
    transition: background-color $transition, color $transition, box-shadow $transition;
    @include focus-ring($c-mint-300);

    &--outline {
      box-shadow: -2px -2px $c-tan-500, 2px 2px $c-tan-500;

      &:hover { background: rgba($c-white, 0.12); }
    }

    &--solid {
      border-width: 0;
      background: $c-tan-500;
      box-shadow: -2px -2px $c-white, 2px 2px $c-mint-100;

      &:hover { background: $c-brown-500; }
    }
  }

  &__inset {
    width: 100%;
    max-width: map.get($hero-inset, w);
    margin-top: $space-xs;
  }

  &__box { display: none; }

  &__label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 14px;
    font-size: 16px;
    font-weight: $fw-semibold;
    line-height: 1.1;
    background: rgba($c-green-900, 0.42);
    border: 1px solid rgba($c-white, 0.55);
  }

  &__label--feature { background: rgba($c-green-800, 0.62); }

  &__scroll { display: none; }

  @include up(lg) {
    &__stage {
      --k: tan(atan2(100vw, #{$stage-w}));

      position: absolute;
      top: 50%;
      left: 50%;
      width: $stage-w;
      height: $stage-h;
      padding: 0;
      display: block;
      transform: translate(-50%, -50%) scale(var(--k));
      transform-origin: center center;
    }

    &__title {
      @include place($hero-title);
      font-size: $hero-title-fs;
      height: auto;
    }

    &__lead { @include place($hero-sub); max-width: none; font-size: 20px; }

    &__btn {
      padding: 0;
      font-size: 14px;
    }
    &__btn--outline { @include place($hero-btn1); }
    &__btn--solid   { @include place($hero-btn2); }

    &__inset { @include place($hero-inset); max-width: none; margin: 0; }

    &__box {
      display: block;
      background: rgba($c-green-900, 0.42);
      border: 1px solid rgba($c-white, 0.55);
    }
    &__box--feature { @include place($hero-stat-big); background: rgba($c-green-800, 0.62); }

    @each $i, $spec in (1: list.nth($hero-stats, 1), 2: list.nth($hero-stats, 2), 3: list.nth($hero-stats, 3)) {
      &__box--#{$i} { @include place($spec); }
    }

    &__label {
      padding: 0;
      background: none;
      border: 0;
      font-size: 16px;
      line-height: 1.15;

      align-items: center;
      text-align: center;
    }
    &__label--feature {
      @include place($hero-label-big);
      font-size: 20px;
      font-weight: $fw-medium;
    }

    @each $i, $spec in (1: list.nth($hero-labels, 1), 2: list.nth($hero-labels, 2), 3: list.nth($hero-labels, 3)) {
      &__label--#{$i} { @include place($spec); }
    }

    &__scroll {
      @include place($hero-chevron, $with-size: false);
      display: grid;
      place-items: center;
      width: map.get($hero-chevron, w);
      color: rgba($c-white, 0.85);

      animation: hero-chevron 1s ease-in-out infinite alternate;
      @include focus-ring($c-mint-300);

      &:hover { color: $c-white; animation-play-state: paused; }
    }
  }
}

@keyframes hero-chevron {
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(14px); opacity: 0.75; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__scroll { animation: none; }
}
</style>
