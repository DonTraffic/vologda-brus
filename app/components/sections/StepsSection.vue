<script setup lang="ts">
import { STEPS } from '~/data/content'

/** В текстах шагов есть переносы строк — на сайте они видны. */
const lines = (t: string) => t.split('\n')
</script>

<template>
  <section id="steps" class="st">
    <div class="st__inner">
      <h2 class="st__title">{{ STEPS.title }}</h2>

      <ol class="st__grid">
        <li v-for="(s, i) in STEPS.items" :key="s.title" class="st__item">
          <!-- Кружок с номером появляется проявлением, текст — выездом слева -->
          <div class="st__numwrap" v-reveal="{ style: 'fade' }">
            <span class="st__num">{{ i + 1 }}</span>
            <span v-if="i < STEPS.items.length - 1" class="st__line" aria-hidden="true" />
          </div>

          <div class="st__body" v-reveal="{ style: 'right', delay: (i % 3) * 0.16 }">
            <h3 class="st__name">
              {{ s.title }}<template v-if="s.meta"><br>{{ s.meta }}</template>
            </h3>
            <p class="st__text">
              <template v-for="(ln, j) in lines(s.text)" :key="j">
                <br v-if="j">{{ ln }}
              </template>
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
// Блок t1106 действующего сайта: поля 60/75, заголовок 36 с отбивкой 105,
// кружок 34 + белая рамка 2, линия 2px бежевая от кружка до следующего,
// заголовок шага 18/24,3 с отступом 20, текст 14/21,7 с отступом 16.
.st {
  background: $c-green-800;
  padding-block: clamp(40px, 4.5vw, 60px) clamp(40px, 5vw, 75px);

  &__inner { @include t-container; }

  &__title {
    font-size: clamp(1.5rem, 1.2rem + 1.5vw, 36px);
    font-weight: $fw-semibold;
    line-height: 1.23;
    color: $c-white;
    margin-bottom: 45px;

    @media (min-width: #{$t-bp-lg}) { margin-bottom: 105px; }
  }

  &__grid {
    @include t-cols-3;
    row-gap: $space-lg;

    @media (min-width: #{$t-bp-lg}) { row-gap: 100px; }
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__numwrap { position: relative; height: 38px; }

  &__num {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    font-size: 14px;
    font-weight: $fw-semibold;
    color: $c-white;
    background: $c-brown-700;
    border: 2px solid $c-white;
    border-radius: 50%;
  }

  // Линия тянется от кружка до кружка следующей карточки, поэтому её длина —
  // ширина колонки плюс промежуток. У третьего шага она так же уходит
  // за край сетки, как в оригинале.
  &__line {
    position: absolute;
    top: 18px;
    left: 39px;
    display: none;
    height: 2px;
    background: $c-tan-500;

    @media (min-width: #{$t-bp-lg}) {
      display: block;
      width: calc(100% + #{$t-gap-sm} - 39px);
    }

    @media (min-width: #{$t-bp-xl}) {
      width: calc(100% + #{$t-gap-lg} - 39px);
    }
  }

  &__name { margin-top: 20px; font-size: 18px; font-weight: $fw-semibold; line-height: 24.3px; color: $c-white; }
  &__text { margin-top: 16px; font-size: 14px; line-height: 21.7px; color: $c-tan-500; }
}
</style>
