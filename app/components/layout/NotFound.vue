<script setup lang="ts">

const props = withDefaults(defineProps<{ code?: number }>(), { code: 404 })

const is404 = computed(() => props.code === 404)
</script>

<template>
<section class="e404">
    <div class="e404__grain" aria-hidden="true" />

    <svg class="e404__scene" viewBox="0 0 560 170" role="img" xmlns="http://www.w3.org/2000/svg">
      <title>Дом из бруса с табличкой {{ code }}</title>
      <desc>Иллюстрация недостроенного дома из бруса</desc>

      <rect x="60" y="152" width="440" height="3" rx="1" fill="#4A3418" />
      <rect x="30" y="153" width="500" height="2" rx="1" fill="#3A2810" opacity="0.5" />

      <rect x="130" y="85" width="300" height="72" fill="#2A1A08" stroke="#3D2510" stroke-width="1" />
      <rect x="130" y="85" width="300" height="10" fill="#3A2510" opacity="0.7" />
      <rect x="130" y="103" width="300" height="10" fill="#3A2510" opacity="0.7" />
      <rect x="130" y="121" width="300" height="10" fill="#3A2510" opacity="0.7" />
      <rect x="130" y="139" width="300" height="10" fill="#3A2510" opacity="0.7" />
      <line x1="130" y1="89" x2="430" y2="89" stroke="#5A3C1A" stroke-width="0.5" opacity="0.4" />
      <line x1="130" y1="107" x2="430" y2="107" stroke="#5A3C1A" stroke-width="0.5" opacity="0.4" />
      <line x1="130" y1="125" x2="430" y2="125" stroke="#5A3C1A" stroke-width="0.5" opacity="0.4" />
      <line x1="130" y1="143" x2="430" y2="143" stroke="#5A3C1A" stroke-width="0.5" opacity="0.4" />

      <polygon points="105,85 280,18 455,85" fill="#1A0E05" stroke="#2E1C08" stroke-width="1.5" />
      <line x1="105" y1="85" x2="280" y2="18" stroke="#4A3018" stroke-width="1.5" />
      <line x1="280" y1="18" x2="455" y2="85" stroke="#4A3018" stroke-width="1.5" />
      <line x1="105" y1="85" x2="455" y2="85" stroke="#3A2410" stroke-width="1.5" />

      <rect x="236" y="103" width="88" height="54" rx="3" fill="#0E0804" stroke="#2A1808" stroke-width="1" />
      <rect x="238" y="105" width="84" height="50" rx="2" fill="#120A06" />
      <text x="280" y="136" font-size="22" font-weight="700" fill="#D4A96A" text-anchor="middle" letter-spacing="2">{{ code }}</text>
      <text x="280" y="150" font-size="8" fill="#6A4A28" text-anchor="middle" letter-spacing="3">СТРАНИЦА</text>
      <circle cx="320" cy="130" r="2.5" fill="#3A2410" />

      <rect x="152" y="107" width="55" height="40" rx="2" fill="#0A1820" stroke="#1A3040" stroke-width="0.8" />
      <line x1="179" y1="107" x2="179" y2="147" stroke="#1A3040" stroke-width="0.5" />
      <line x1="152" y1="127" x2="207" y2="127" stroke="#1A3040" stroke-width="0.5" />
      <rect x="353" y="107" width="55" height="40" rx="2" fill="#0A1820" stroke="#1A3040" stroke-width="0.8" />
      <line x1="380" y1="107" x2="380" y2="147" stroke="#1A3040" stroke-width="0.5" />
      <line x1="353" y1="127" x2="408" y2="127" stroke="#1A3040" stroke-width="0.5" />

      <rect x="260" y="34" width="40" height="30" rx="1" fill="#241408" stroke="#3A2010" stroke-width="0.8" />
      <rect x="265" y="20" width="30" height="18" rx="1" fill="#1E1006" stroke="#342010" stroke-width="0.8" />
      <rect x="271" y="8" width="18" height="14" rx="1" fill="#180C04" stroke="#2A1808" stroke-width="0.8" />

      <rect x="452" y="134" width="11" height="22" rx="1" fill="#3A2810" />
      <ellipse cx="457" cy="129" rx="15" ry="11" fill="#1A3010" />
      <ellipse cx="449" cy="133" rx="10" ry="8" fill="#243818" />
      <rect x="88" y="140" width="10" height="16" rx="1" fill="#3A2810" />
      <ellipse cx="93" cy="136" rx="13" ry="10" fill="#243818" />
      <ellipse cx="85" cy="139" rx="8" ry="7" fill="#1A3010" />

      <g opacity="0.35">
        <rect x="474" y="128" width="28" height="6" rx="1" fill="#4A3418" />
        <rect x="471" y="138" width="28" height="6" rx="1" fill="#3A2810" />
        <rect x="475" y="148" width="28" height="6" rx="1" fill="#4A3418" />
      </g>
      <g opacity="0.35">
        <rect x="54" y="132" width="28" height="6" rx="1" fill="#4A3418" />
        <rect x="50" y="142" width="28" height="6" rx="1" fill="#3A2810" />
        <rect x="55" y="152" width="28" height="6" rx="1" fill="#4A3418" />
      </g>
    </svg>

    <div class="e404__divider" />

    <p class="e404__tagline">{{ is404 ? 'страница не найдена' : 'что-то пошло не так' }}</p>

    <h1 class="e404__headline">
      {{ is404 ? 'Этот брус куда-то делся' : 'Стройка на минуту встала' }}
    </h1>

    <p class="e404__sub">
      <template v-if="is404">
        Страница не найдена — но <em>дом мечты</em> никуда не пропал.<br>
        Вернитесь на главную, и мы доведём проект до конца.
      </template>
      <template v-else>
        Мы уже разбираемся. Обновите страницу<br>
        или вернитесь на главную.
      </template>
    </p>

    <div class="e404__btns">
      <NuxtLink to="/" class="e404__btn e404__btn--main">На главную</NuxtLink>
      <NuxtLink to="/#projects" class="e404__btn e404__btn--ghost">Смотреть проекты</NuxtLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.e404 {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px clamp($gutter, 3vw, 40px) 40px;
  overflow: hidden;
  text-align: center;
  background: #1c1208;
  border-radius: 16px;

  &__grain {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    pointer-events: none;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.012) 3px, rgba(255, 255, 255, 0.012) 4px),
      repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255, 255, 255, 0.008) 8px, rgba(255, 255, 255, 0.008) 9px);
  }

  &__scene {
    position: relative;
    z-index: 1;
    width: 100%;
    height: auto;
    margin-bottom: 4px;
    font-family: $font-body;
  }

  &__divider {
    position: relative;
    z-index: 1;
    width: 40px;
    height: 1px;
    margin: 0 auto 20px;
    background: rgba(212, 169, 106, 0.3);
  }

  &__tagline {
    position: relative;
    z-index: 1;
    margin: 0 0 12px;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #a07840;
  }

  &__headline {
    position: relative;
    z-index: 1;
    margin: 0 0 10px;
    font-size: clamp(1.375rem, 1.1rem + 1vw, 28px);
    font-weight: $fw-bold;
    line-height: 1.2;
    color: #f0e6d0;
  }

  &__sub {
    position: relative;
    z-index: 1;
    max-width: 420px;
    margin: 0 0 28px;
    font-size: 14px;
    font-weight: $fw-light;
    line-height: 1.65;
    color: #8a7055;

    em { font-style: italic; color: #c49a60; }
  }

  &__btns {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  &__btn {
    padding: 13px 32px;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-radius: 6px;
    transition: background-color $transition, border-color $transition, color $transition, transform 0.15s;
    @include focus-ring(#d4a96a);

    &--main {
      font-weight: $fw-bold;
      color: #563635;
      background: $c-tan-500;

      &:hover { background: #e8bf80; transform: translateY(-2px); }
    }

    &--ghost {
      font-weight: $fw-semibold;
      color: #ff8562;
      border: 1px solid #3d2010;

      &:hover { color: #d4a96a; border-color: #d4a96a; transform: translateY(-2px); }
    }
  }
}
</style>
