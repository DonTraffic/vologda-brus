<script setup lang="ts">
import { FOOTER_NAV, PHONE_DISPLAY, PHONE_HREF, EMAIL, ADDRESS, COMPANY, LEGAL } from '~/data/site'

const year = new Date().getFullYear()
function toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
</script>

<template>
  <ZeroStage tag="footer" :height="620" bg="#114c3e">
    <p class="ft__tagline">
      {{ COMPANY.name }} — производство клееного бруса полного цикла и строительство домов<br>
      под контролем производителя
    </p>

    <div class="ft__rule" aria-hidden="true" />

    <p class="ft__cap ft__cap--contacts">(Наши контакты)</p>
    <address class="ft__contacts">
      {{ ADDRESS.full }}<br>
      <a :href="`tel:${PHONE_HREF}`">{{ PHONE_DISPLAY }}</a><br>
      <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
    </address>

    <p class="ft__cap ft__cap--nav">(Навигация)</p>
    <nav class="ft__nav" aria-label="Навигация в подвале">
      <NuxtLink v-for="n in FOOTER_NAV" :key="n.href" :to="n.href">{{ n.label }}</NuxtLink>
    </nav>

    <!-- Реквизитов в подвале оригинала нет; для сделки на миллионы они нужны -->
    <p class="ft__legal">
      {{ LEGAL.name }}<br>
      ИНН {{ LEGAL.inn }}<span v-if="LEGAL.ogrnip"> · ОГРНИП {{ LEGAL.ogrnip }}</span>
    </p>

    <!-- FIX: в оригинале «публичной оффертой» с двумя «ф» -->
    <p class="ft__copy">
      © {{ year }} Все права защищены | Не является публичной офертой.
      Цены уточняйте по телефону
    </p>

    <NuxtLink to="/privacy-policy" class="ft__policy">Политика конфиденциальности</NuxtLink>
    <button type="button" class="ft__top" @click="toTop">Наверх</button>
  </ZeroStage>
</template>

<style scoped lang="scss">
.ft {
  &__tagline { font-size: clamp(1.125rem, 1rem + 0.8vw, 24px); font-weight: $fw-medium; line-height: 30px; color: $c-white; margin-bottom: $space-lg; }

  &__cap { font-size: 15px; line-height: 23px; color: $c-tan-500; margin-bottom: 6px; }
  &__cap--nav { margin-top: $space-md; }

  &__contacts {
    font-size: 20px;
    font-style: normal;
    line-height: 25px;
    color: $c-white;

    a:hover { color: $c-mint-300; }
  }

  &__nav {
    display: grid;
    gap: 2px;
    font-size: 20px;
    font-weight: $fw-medium;
    line-height: 31px;
    color: $c-mint-300;

    a { @include focus-ring($c-mint-300); &:hover { text-decoration: underline; } }
  }

  &__rule { height: 1px; margin-block: $space-lg; background: $c-tan-500; }

  &__legal { margin-top: $space-md; font-size: 13px; line-height: 18px; color: rgba($c-mint-300, 0.8); }

  &__copy { margin-top: $space-sm; font-size: 15px; line-height: 23.25px; color: $c-mint-300; }

  &__policy, &__top {
    display: inline-block;
    margin-top: $space-sm;
    margin-right: $space-md;
    font-size: 15px;
    font-weight: $fw-medium;
    line-height: 23.25px;
    color: $c-mint-300;
    @include focus-ring($c-mint-300);

    &:hover { text-decoration: underline; }
  }

  @include up(lg) {
    &__tagline  { @include place((x: 20px, y: 100px, w: 563px, h: 90px)); font-size: 24px; margin: 0; }
    &__cap--contacts { @include place((x: 20px, y: 321px, w: 461px, h: 23px)); margin: 0; }
    &__cap--nav      { @include place((x: 620px, y: 321px, w: 561px, h: 23px)); margin: 0; }
    &__contacts { @include place((x: 20px, y: 364px, w: 461px, h: 100px)); }
    &__nav      { @include place((x: 620px, y: 366px, w: 300px, h: 130px)); gap: 2px; }
    &__rule     { @include place((x: 20px, y: 270px, w: 1160px, h: 1px)); margin: 0; }
    &__legal    { @include place((x: 20px, y: 470px, w: 461px, h: 54px)); margin: 0; }
    &__copy     { @include place((x: 20px, y: 535px, w: 488px, h: 47px)); margin: 0; }
    &__policy   { @include place((x: 548px, y: 530px, w: 260px, h: 23px)); margin: 0; white-space: nowrap; }
    &__top      { @include place((x: 930px, y: 530px, w: 54px, h: 23px)); margin: 0; }
  }
}
</style>
