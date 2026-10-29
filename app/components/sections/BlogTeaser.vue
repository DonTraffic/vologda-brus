<script setup lang="ts">
import { POSTS } from '~/data/posts'
const latest = computed(() => POSTS.slice(0, 3))
</script>

<template>
  <section class="bl">
    <div class="bl__inner">
      <h2 class="bl__title">Блог</h2>

      <ul class="bl__grid" role="list">
        <li
          v-for="(p, i) in latest" :key="p.slug" class="bl__post"
          v-reveal="{ style: 'zoom', delay: i * 0.16 }"
        >
          <NuxtLink :to="`/blog/${p.slug}/`" class="bl__link">
            <div v-if="p.cover" class="bl__thumb">
              <SmartImage :name="p.cover" :alt="p.title" cover sizes="(min-width: 1024px) 300px, 90vw" />
            </div>
            <h3 class="bl__name">{{ p.title }}</h3>
            <p v-if="p.description" class="bl__desc">{{ p.description }}</p>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.bl {
  background: $c-white;
  padding-block: clamp(30px, 3.5vw, 45px) clamp(40px, 6vw, 90px);

  &__inner { @include t-container; }

  &__title {
    font-size: clamp(1.5rem, 1.2rem + 1.5vw, 36px);
    font-weight: $fw-semibold;
    line-height: 1.23;
    color: $c-brown-900;
    margin-bottom: clamp($space-md, 3vw, 40px);

    @media (min-width: #{$t-bp-lg}) { margin-bottom: 25px; }
  }

  &__grid {
    @include t-cols-3;
    row-gap: 30px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__link { display: block; @include focus-ring; &:hover .bl__name { color: $c-brown-500; } }

  &__thumb {
    aspect-ratio: 360 / 277;
    overflow: hidden;
    margin-bottom: 20px;
    background: $c-sand;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__name {
    font-size: 18px;
    font-weight: $fw-semibold;
    line-height: 24.3px;
    color: $c-brown-900;
    transition: color $transition;

    @media (min-width: #{$t-bp-xl}) { font-size: 20px; line-height: 27px; }
  }
  &__desc { margin-top: 10px; font-size: 12px; line-height: 18.6px; color: rgba($c-black, 0.9); }
}
</style>
