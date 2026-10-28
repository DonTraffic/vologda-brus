<script setup lang="ts">
import { PRODUCTS } from '~/data/content'
const { open: openMessengers } = useMessengerModal()

const { el: track, scrollByCards } = useCarousel({ interval: 5000, gap: 40 })
</script>

<template>
  <section id="products" class="pr">
    <div class="pr__head">
      <h2 class="pr__title">{{ PRODUCTS.kicker }}</h2>
      <div class="pr__row">
        <p class="pr__sub">{{ PRODUCTS.title }}</p>
        <div class="pr__nav">
          <button type="button" class="pr__arrow" aria-label="Предыдущие" @click="scrollByCards(-1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M15 5 8 12l7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button type="button" class="pr__arrow" aria-label="Следующие" @click="scrollByCards(1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ul ref="track" class="pr__track" role="list">
      <li v-for="p in PRODUCTS.items" :key="p.title" class="pr__card">
        <div class="pr__thumb">
          <SmartImage :name="p.image" :alt="p.title" cover sizes="(min-width: 1201px) 356px, 80vw" />
        </div>
        <div class="pr__body">
          <h3 class="pr__name">{{ p.title }}</h3>
          <p class="pr__text">{{ p.text }}</p>
          <NuxtLink v-if="p.href" :to="p.href" class="pr__cta">{{ p.cta }}</NuxtLink>
          <!-- У карточек без своей страницы призыв ведёт к форме расчёта,
               а окно выбора мессенджера перехватывает клик поверх неё -->
          <a v-else href="#calc" class="pr__cta" @click.prevent="openMessengers()">{{ p.cta }}</a>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
// Блок t1196: карточки 360×482 с рамкой 2 px, снимок 356×270, лента уходит
// за правый край экрана, кнопки перелистывания — в строке подзаголовка.
.pr {
  background: $c-white;
  padding-block: clamp(30px, 3.5vw, 45px) clamp(40px, 5vw, 75px);

  &__head { @include t-container; margin-bottom: clamp($space-md, 2.5vw, 30px); }

  &__title { font-size: clamp(1.5rem, 1.2rem + 1.5vw, 36px); font-weight: $fw-medium; line-height: 1.25; }

  &__row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: $space-md;
    margin-top: 20px;
  }

  &__sub { margin: 0; font-size: clamp(1.0625rem, 0.95rem + 0.7vw, 20px); font-weight: $fw-light; line-height: 1.5; }

  &__nav { display: none; gap: 5px; flex: none; @include up(md) { display: flex; } }

  &__arrow {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    color: $c-brown-500;
    border: 1px solid $c-brown-500;
    border-radius: 50%;
    transition: background-color $transition, color $transition;
    @include focus-ring;

    &:hover { color: $c-white; background: $c-brown-500; }
  }

  // Лента во всю ширину окна: первая карточка начинается от края колонки,
  // остальные уходят за правый край, как в оригинале
  &__track {
    display: flex;
    gap: 40px;
    margin: 0;
    padding: 2px $gutter;
    list-style: none;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    user-select: none;

    &::-webkit-scrollbar { display: none; }

    // Поле справа такое же, как слева: тогда в конце прокрутки последняя
    // карточка встаёт ровно по правому краю колонки, а на широком экране
    // лента не упирается после первых ста пикселей.
    @media (min-width: #{$t-bp-lg}) { padding-inline: calc((100vw - 960px) / 2 + 20px); }
    @media (min-width: #{$t-bp-xl}) { padding-inline: calc((100vw - 1200px) / 2 + 20px); }
  }

  &__card {
    flex: 0 0 min(360px, 82vw);
    display: flex;
    flex-direction: column;
    border: 2px solid $c-tan-500;
  }

  &__thumb {
    aspect-ratio: 356 / 270;
    overflow: hidden;
    background: $c-sand;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
  }

  &__body { display: flex; flex-direction: column; flex: 1; padding: 32px; }
  &__name { font-size: 20px; font-weight: $fw-medium; line-height: 27px; color: $c-brown-900; }
  &__text { margin-top: 4px; font-size: 16px; line-height: 23px; }

  &__cta {
    // И NuxtLink, и обычная ссылка — рамку задаём сами, как было у <button>
    display: inline-block;
    text-align: center;
    align-self: flex-start;
    margin-top: auto;
    padding: 8px 15px;
    font-size: 13px;
    font-weight: $fw-semibold;
    color: $c-white;
    background: $c-green-800;
    transition: background-color $transition;
    @include focus-ring;

    &:hover { background: $c-green-700; }
  }
}
</style>
