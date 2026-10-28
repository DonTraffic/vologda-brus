<script setup lang="ts">
import { BINDER } from '~/data/content'
const { open: openMessengers } = useMessengerModal()
</script>

<template>
  <section class="bn">
    <div class="bn__inner">
      <!-- Фото и панель лежат в одной ячейке сетки: тёмная карточка
           намеренно заходит на снимок слева. Это приём макета. -->
      <div class="bn__photo" v-reveal="'left'">
        <SmartImage
          :name="BINDER.image"
          alt="Биндер клееный — заготовка клееного бруса на производстве в Вологде"
          cover
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>

      <div class="bn__panel">
        <h2 class="bn__title" v-reveal="{ style: 'right', delay: 0.3 }">{{ BINDER.title }}</h2>
        <span class="bn__rule" aria-hidden="true" />
        <p class="bn__sub" v-reveal="{ style: 'right', delay: 0.6 }">{{ BINDER.subtitle }}</p>
        <ul class="bn__list">
          <li v-for="f in BINDER.features" :key="f">{{ f }}.</li>
        </ul>
        <!-- Ссылка на форму расчёта, окно мессенджеров — надстройка поверх.
             См. первый экран: без скриптов призыв всё равно ведёт к заявке. -->
        <a href="#calc" class="bn__cta" @click.prevent="openMessengers()">{{ BINDER.cta }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.bn {
  background: $c-white;
  padding-block: clamp(30px, 3.5vw, 45px);

  &__inner {
    @include t-container;
    display: grid;
    gap: 0;
  }

  &__photo {
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: $c-sand;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__panel {
    display: flex;
    flex-direction: column;
    padding: clamp($space-md, 4vw, 60px);
    background: $c-green-800;
    color: $c-white;
  }

  &__title { font-size: clamp(1.5rem, 1.15rem + 1.8vw, 38px); font-weight: $fw-medium; line-height: 1.23; color: $c-white; }
  &__rule { display: block; width: 50px; height: 2px; margin: 18px 0 30px; background: $c-tan-500; }
  &__sub { font-size: 18px; line-height: 27.9px; }
  &__list { margin: 0; padding-left: 20px; font-size: 18px; line-height: 27.9px; }

  &__cta {
    // Ссылка, а не кнопка: эти две строки держат ту же рамку, что у <button>
    display: inline-block;
    text-align: center;
    margin-top: clamp($space-lg, 5vw, 85px);
    padding: 15px 30px;
    font-size: 15px;
    font-weight: $fw-semibold;
    color: $c-green-700;
    background: $c-white;
    @include focus-ring($c-mint-300);

    &:hover { background: $c-mint-100; }
  }

  // Раскладка блока t814: снимок лежит слева от самого края колонки,
  // зелёная панель накрывает его почти целиком и заканчивается ниже —
  // из-под неё видна только правая полоса фотографии.
  @media (min-width: #{$t-bp-lg}) {
    // padding-top вместо margin у панели: иначе отступ схлопывается
    // наружу и снимок встаёт вровень с панелью вместо сдвига вверх
    &__inner { position: relative; display: block; padding-top: 37px; }

    &__photo {
      position: absolute;
      top: 0;
      left: 425px;
      width: 535px;
      height: 405px;
      aspect-ratio: auto;
    }

    &__panel {
      position: relative;
      z-index: 1;
      width: 452px;
      min-height: 430px;
      padding: 50px;
    }

    &__cta { align-self: flex-start; margin-top: clamp($space-lg, 4vw, 60px); }
  }

  @media (min-width: #{$t-bp-xl}) {
    &__inner { padding-top: 46px; }
    &__photo { left: 520px; width: 660px; height: 500px; }

    &__panel {
      width: 552px;
      min-height: 525px;
      padding: 60px;
    }

    &__title { font-size: 42px; line-height: 52px; }
    &__sub, &__list { font-size: 20px; line-height: 31px; }
  }
}
</style>
