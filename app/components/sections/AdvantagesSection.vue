<script setup lang="ts">
import { ADVANTAGES } from '~/data/content'
</script>

<template>
  <section class="adv">
    <div class="adv__inner">
      <h2 class="adv__title">{{ ADVANTAGES.title }}</h2>

      <ul class="adv__grid" role="list">
        <li
          v-for="(item, i) in ADVANTAGES.items" :key="item" class="adv__card"
          v-reveal="{ style: 'left', delay: i * 0.16 }"
        >
          <p class="adv__text">{{ item }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.adv {
  background: $c-green-800;
  padding-block: clamp(40px, 4.5vw, 60px) clamp(40px, 5vw, 75px);

  &__inner { @include t-container; }

  &__title {
    font-size: clamp(1.5rem, 1.2rem + 1.5vw, 36px);
    font-weight: $fw-semibold;
    line-height: 1.23;
    color: $c-white;
    margin-bottom: clamp($space-lg, 6vw, 90px);
  }

  &__grid {
    display: grid;
    gap: 20px;
    margin: 0; padding: 0; list-style: none;
    grid-template-columns: repeat(2, 1fr);

    @include up(md) { grid-template-columns: repeat(4, 1fr); }
  }

  &__card {
    display: grid;
    place-items: center;
    min-height: 204px;
    padding: 30px;
    background: $c-mint-100;
  }

  &__text {
    font-size: clamp(1rem, 0.9rem + 0.5vw, 20px);
    font-weight: $fw-semibold;
    line-height: 1.35;
    text-align: center;
    color: #333;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba($c-brown-500, 0.55);
  }
}
</style>
