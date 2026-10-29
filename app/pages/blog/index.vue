<script setup lang="ts">
import { POSTS } from '~/data/posts'
import { COMPANY } from '~/data/site'

useSeo({
  title: 'Блог о клееном брусе и строительстве домов',
  description:
    'Разбираем, как отличить качественный клееный брус от подделки, как считается стоимость дома и как проходит путь от идеи до готового объекта.',
})
</script>

<template>
  <div class="blog">

    <section class="cover">
      <div class="cover__img">
        <SmartImage name="blog-hero" alt="" priority cover sizes="100vw" />
      </div>
      <div class="cover__shade" />
      <div class="cover__body">
        <p class="cover__eyebrow">{{ COMPANY.name }}</p>
        <h1 class="cover__title">Блог</h1>
      </div>
      <a href="#feed" class="cover__arrow" aria-label="К списку статей">
        <svg width="38" height="23" viewBox="0 0 38 23" fill="none" aria-hidden="true">
          <path d="M1 1L19 20L37 1" stroke="currentColor" stroke-width="2" />
        </svg>
      </a>
    </section>

    <section id="feed" class="feed">
      <ul class="feed__grid" role="list">
        <li v-for="p in POSTS" :key="p.slug" class="card">
          <NuxtLink :to="`/blog/${p.slug}/`" class="card__link">
            <span v-if="p.cover" class="card__thumb">
              <SmartImage :name="p.cover" :alt="p.title" cover sizes="(min-width: 1024px) 300px, 100vw" />
            </span>
            <span class="card__title">{{ p.title }}</span>
            <span v-if="p.description" class="card__descr">{{ p.description }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">

.cover {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  padding: $space-2xl $gutter $space-xl;
  overflow: hidden;
  text-align: center;
  color: $c-white;
  background: $c-black;

  @include up(lg) { min-height: 700px; padding: 0 130px; }

  @media (min-width: #{$t-bp-xl}) { padding-inline: 380px; }

  &__img {
    position: absolute;
    inset: 0;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__shade { position: absolute; inset: 0; background: rgba($c-black, 0.7); }

  &__body { position: relative; }

  &__eyebrow {
    margin: 0 0 $space-lg;
    font-size: 14px;
    font-weight: $fw-semibold;
    letter-spacing: 2.5px;
    text-transform: uppercase;

    @include up(lg) { margin-bottom: 90px; }
  }

  &__title {
    margin: 0;
    font-size: clamp(2.25rem, 1.625rem + 3.5vw, 72px);
    font-weight: $fw-semibold;
    line-height: 1.17;
    letter-spacing: 0.5px;
    color: inherit;

    @include up(lg) { padding-bottom: 62px; }
  }

  &__arrow {
    position: absolute;
    left: 50%;
    bottom: 40px;
    transform: translateX(-50%);
    color: $c-white;
    opacity: 0.9;
    transition: opacity $transition, transform $transition;
    @include focus-ring($c-white);

    &:hover { opacity: 1; transform: translateX(-50%) translateY(3px); }
  }
}

.feed {
  background: $c-white;
  padding-block: clamp(40px, 7vw, 100px) clamp(40px, 5vw, 60px);

  @include up(lg) { padding-block: 135px 75px; }

  &__grid {
    @include t-container;
    @include t-cols-3;
    row-gap: clamp(40px, 5vw, 60px);
    list-style: none;

    @media (min-width: #{$t-bp-lg}) { row-gap: 90px; }
  }
}

.card {
  &__link {
    display: block;
    @include focus-ring;

    &:hover .card__title { color: $c-brown-500; }
  }

  &__thumb {
    display: block;
    aspect-ratio: 360 / 277;
    overflow: hidden;
    background: $c-sand;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__title {
    display: block;
    margin-top: 20px;
    font-size: 18px;
    font-weight: $fw-semibold;
    line-height: 24.3px;
    color: $c-brown-900;
    transition: color $transition;

    @media (min-width: #{$t-bp-xl}) { font-size: 20px; line-height: 27px; }
  }

  &__descr {
    display: block;
    margin-top: 7px;
    font-size: 12px;
    line-height: 18.6px;
    color: rgba($c-black, 0.9);
  }
}
</style>
