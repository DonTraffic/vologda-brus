<script setup lang="ts">
import { EXCURSION } from '~/data/content'
const { open: openMessengers } = useMessengerModal()
</script>

<template>
  <section id="excursion" class="exc">
    <div class="exc__inner" v-reveal>
      <!-- Знак «//» над текстом — он есть в оригинале блока -->
      <div class="exc__icon" aria-hidden="true">
        <svg width="37" height="31" viewBox="0 0 37 31" fill="currentColor">
          <path d="M9.2342197,31 L0.520616382,31 L12.8070131,0.73046875 L21.5206164,0.73046875 L9.2342197,31 Z" />
          <path d="M24.5963811,31 L15.8827778,31 L28.1691745,0.73046875 L36.8827778,0.73046875 L24.5963811,31 Z" />
        </svg>
      </div>

      <h2 class="exc__title">{{ EXCURSION.title }}</h2>
      <p class="exc__text">{{ EXCURSION.text }}</p>
    </div>
  </section>

  <!-- Призыв во всю ширину: тонкие линии сверху и снизу — это тени кнопки -->
  <div class="excbtn">
    <!-- Ссылка на форму записи, окно мессенджеров — надстройка поверх -->
    <a href="#consult" class="excbtn__btn" v-reveal="'right'" @click.prevent="openMessengers()">
      <span class="excbtn__text">{{ EXCURSION.cta }}</span>
      <span class="excbtn__icon" aria-hidden="true">
        <svg width="33" height="33" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </a>
  </div>
</template>

<style scoped lang="scss">
// Снято с блока t267 действующего сайта: поля 45/45, знак «//» по центру,
// текст слева, кегли 32 (первая строка) и 30, цвет — чёрный.
.exc {
  background: $c-white;
  padding-block: 45px;

  &__inner { @include t-container; }

  &__icon {
    color: $c-black;
    text-align: center;

    svg { display: inline-block; vertical-align: top; }
  }

  &__title {
    margin: 20px 0 0;
    font-size: clamp(1.375rem, 1.1rem + 1.1vw, 32px);
    font-weight: $fw-semibold;
    line-height: 1.35;
    color: $c-black;
  }

  &__text {
    margin: 0;
    font-size: clamp(1.25rem, 1rem + 1vw, 30px);
    font-weight: $fw-regular;
    line-height: 40.5px;
    color: $c-black;
  }
}

.excbtn {
  padding-bottom: 75px;
  background: $c-white;

  // Кнопка во всю ширину окна, как в оригинале. Линии над и под ней —
  // не рамка, а две тени: -2px -2px и 2px 2px бежевым.
  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    // Ссылка вместо кнопки: выравнивание <button> задавал сам
    text-align: center;
    gap: 18px;
    width: 100%;
    padding: 43px 55px;
    color: $c-brown-900;
    background: $c-white;
    box-shadow: -2px -2px $c-tan-500, 2px 2px $c-tan-500;
    transition: color $transition, background-color $transition;
    @include focus-ring;

    &:hover { color: $c-brown-700; background: rgba($c-tan-500, 0.29); }
  }

  &__text {
    font-size: clamp(1.125rem, 1rem + 0.6vw, 24px);
    font-weight: $fw-semibold;
    line-height: 33.6px;
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 33px;
    height: 33px;
  }
}
</style>
