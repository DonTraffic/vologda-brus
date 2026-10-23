<script setup lang="ts">
import { QUALITY } from '~/data/content'
// В макете ряды чередуют сторону снимка: в 1, 3 и 5 он справа, во 2 и 4 — слева
const flipped = (i: number) => Math.floor(i / 2) % 2 === 1
</script>

<template>
  <section id="quality" class="ql">
    <div class="ql__inner">
      <h2 class="ql__title">{{ QUALITY.title }}</h2>

      <ol class="ql__grid">
        <li
          v-for="(s, i) in QUALITY.items" :key="s.n"
          class="ql__card" :class="{ 'ql__card--flip': flipped(i) }"
        >
          <div class="ql__thumb">
            <SmartImage
              :name="s.image"
              :alt="`Этап ${s.n}: ${s.title.toLowerCase()} — производство клееного бруса`"
              cover
              sizes="(min-width: 1024px) 235px, 50vw"
            />
          </div>
          <div class="ql__body">
            <h3 class="ql__name">{{ s.n }}. {{ s.title }}</h3>
            <p class="ql__text">{{ s.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.ql {
  background: $c-tan-400;
  padding-block: clamp(30px, 3vw, 40px) clamp(40px, 5vw, 76px);

  &__inner { @include t-container; }

  &__title {
    font-size: clamp(1.5rem, 1.2rem + 1.5vw, 36px);
    font-weight: $fw-semibold;
    line-height: 1.23;
    color: $c-brown-900;
    margin-bottom: clamp($space-md, 3vw, 35px);
  }

  // В макете плитки стоят встык, без промежутков, двумя колонками по 580
  &__grid {
    display: grid;
    gap: 20px;
    margin: 0; padding: 0; list-style: none;
    align-items: start;

    @include up(md) { grid-template-columns: 1fr 1fr; }
    @media (min-width: #{$t-bp-lg}) { gap: 0; }
  }

  &__card {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: $c-white;

    // Высота ряда из макета: половина плитки — квадратный снимок 290×290
    @media (min-width: #{$t-bp-lg}) { height: 290px; }
  }

  &__thumb {
    grid-column: 2;
    overflow: hidden;
    background: $c-sand;
    // Пропорция снимка из макета: 235×260. Без неё картинка тянет
    // ряд по своей натуральной высоте, и карточки распухают.
    aspect-ratio: 235 / 260;

    @media (min-width: #{$t-bp-lg}) { aspect-ratio: auto; height: 100%; }

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-column: 1;
    grid-row: 1;
    padding: 20px 24px 24px;

    @media (min-width: #{$t-bp-lg}) { padding: 24px 30px; }

    // Белый уголок, врезающийся в снимок, — деталь макета
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -18px;
      display: none;
      width: 0;
      height: 0;
      border-top: 18px solid transparent;
      border-bottom: 18px solid transparent;
      border-left: 18px solid $c-white;
      transform: translateY(-50%);

      @media (min-width: #{$t-bp-lg}) { display: block; }
    }
  }

  // Перевёрнутый вариант: снимок слева
  &__card--flip {
    .ql__thumb { grid-column: 1; grid-row: 1; }
    .ql__body  { grid-column: 2; grid-row: 1; }

    .ql__body::after {
      right: auto;
      left: -18px;
      border-right: 18px solid $c-white;
      border-left: 0;
    }
  }

  &__name { font-size: clamp(1.125rem, 1rem + 0.6vw, 22px); font-weight: $fw-semibold; line-height: 1.35; color: $c-brown-900; }
  &__text { margin-top: 12px; font-size: 16px; line-height: 24.8px; }
}
</style>
