<script setup lang="ts">
import { FOOTER_NAV, PHONE_DISPLAY, PHONE_HREF, EMAIL, ADDRESS, COMPANY, LEGAL } from '~/data/site'

const year = new Date().getFullYear()
function toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
</script>

<template>
  <footer class="ft">
    <div class="ft__inner">
      <p class="ft__tagline">
        {{ COMPANY.name }} — производство клееного бруса полного цикла и строительство домов<br>
        под контролем производителя
      </p>

      <div class="ft__rule" aria-hidden="true" />

      <div class="ft__cols">
        <div>
          <p class="ft__cap ft__cap--contacts">(Наши контакты)</p>
          <address class="ft__contacts">
            {{ ADDRESS.full }}<br>
            <a :href="`tel:${PHONE_HREF}`">{{ PHONE_DISPLAY }}</a><br>
            <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
          </address>
        </div>

        <div>
          <p class="ft__cap ft__cap--nav">(Навигация)</p>
          <nav class="ft__nav" aria-label="Навигация в подвале">
            <NuxtLink v-for="n in FOOTER_NAV" :key="n.href" :to="n.href">{{ n.label }}</NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Реквизитов в подвале оригинала нет; для сделки на миллионы они нужны -->
      <p class="ft__legal">
        {{ LEGAL.name }}<br>
        ИНН {{ LEGAL.inn }}<span v-if="LEGAL.ogrnip"> · ОГРНИП {{ LEGAL.ogrnip }}</span>
      </p>

      <!-- FIX: в оригинале «публичной оффертой» с двумя «ф» -->
      <div class="ft__bottom">
        <p class="ft__copy">
          © {{ year }} Все права защищены | Не является публичной офертой.
          Цены уточняйте по телефону
        </p>
        <NuxtLink to="/privacy-policy/" class="ft__policy">Политика конфиденциальности</NuxtLink>
        <button type="button" class="ft__top" @click="toTop">Наверх</button>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.ft {
  background: #114c3e;
  padding-block: clamp(40px, 7vw, 72px);

  &__inner { @include t-container; }

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

  // Контакты и навигация — в две колонки, низ подвала — в строку.
  // Доли сетки вместо координат: длинный пункт меню или новая строка
  // реквизитов просто раздвигают блок, а не наезжают на соседний.
  @include up(lg) {
    &__cols {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      column-gap: clamp(32px, 5vw, 80px);
      align-items: start;
    }

    &__cap--nav { margin-top: 0; }

    &__bottom {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: $space-sm $space-lg;
    }

    &__copy { margin: 0; }
  }

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

}
</style>
