<script setup lang="ts">
import { CALC_FORM } from '~/data/content'
import { MESSENGERS } from '~/data/site'

const { state, errorText, submit } = useLeadForm()
const WAYS = ['Телефон', ...MESSENGERS.map(m => m.label)] as const

const form = reactive({ name: '', contact: '', way: WAYS[0] as string })
const honeypot = ref('')
const errors = reactive<Record<string, string>>({})

/** Для телефона и для ника в мессенджере подсказки разные. */
const isPhone = computed(() => form.way === 'Телефон')
const placeholder = computed(() => (isPhone.value ? '+7 900 000-00-00' : '@username'))
const fieldLabel = computed(() => (isPhone.value ? 'Номер телефона' : `Ник в ${form.way}`))

function validate() {
  errors.contact = form.contact.trim().length < 5
    ? (isPhone.value ? 'Укажите номер телефона' : 'Укажите ник')
    : ''
  return !errors.contact
}
async function onSubmit() {
  if (!validate()) return
  await submit({ formName: 'Расчёт стоимости и скидка 10%', ...form }, honeypot.value, GOALS.formCalc)
}
</script>

<template>
  <section id="calc" class="cf">
    <div class="cf__inner">
      <div class="cf__head">
        <h2 class="cf__title">
          {{ CALC_FORM.title }}<br>
          и <span class="cf__accent">скидку 10%</span> на его строительство
        </h2>
        <p class="cf__sub">под контролем производителя</p>
      </div>

      <div class="cf__card">
        <div v-if="state === 'done'" class="cf__done" role="status">
          <span class="cf__done-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m4 12.5 5.5 5.5L20 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <p class="cf__done-title">Заявка отправлена</p>
          <p class="cf__done-text">Свяжемся с вами в течение рабочего дня.</p>
        </div>

        <form v-else class="cf__form" novalidate @submit.prevent="onSubmit">
          <fieldset class="cf__ways">
            <legend class="cf__legend">{{ CALC_FORM.contactLabel }}</legend>
            <div class="cf__chips">
              <label v-for="w in WAYS" :key="w" class="cf__chip">
                <input v-model="form.way" type="radio" name="way" :value="w">
                <span>{{ w }}</span>
              </label>
            </div>
          </fieldset>

          <div class="cf__row">
            <input
              v-model="form.contact" class="cf__input" :type="isPhone ? 'tel' : 'text'" name="contact"
              :autocomplete="isPhone ? 'tel' : 'off'" :placeholder="placeholder" :aria-label="fieldLabel"
              :aria-invalid="!!errors.contact || undefined"
            >
            <button type="submit" class="cf__submit" :disabled="state === 'sending'">
              {{ state === 'sending' ? 'Отправляем…' : CALC_FORM.submit }}
            </button>
          </div>

          <div class="cf__trap" aria-hidden="true">
            <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off">
          </div>

          <p v-if="errors.contact || state === 'error'" class="cf__err" role="alert">
            {{ errors.contact || errorText }}
          </p>

          <p class="cf__consent">
            Нажимая на кнопку, вы даёте согласие на обработку персональных данных и соглашаетесь с
            <NuxtLink to="/privacy-policy/">политикой конфиденциальности</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cf {
  background: $c-green-800;
  padding-block: clamp(48px, 7vw, 100px);

  // Цвета таблеток на тёмном фоне
  --chip-fg: #{rgba($c-white, 0.88)};
  --chip-bg: #{rgba($c-white, 0.06)};
  --chip-bd: #{rgba($c-white, 0.3)};
  --chip-fg-on: #{$c-green-900};
  --chip-bg-on: #{$c-tan-500};
  --chip-bd-on: #{$c-tan-500};
  --chip-ring: #{$c-mint-300};

  &__inner {
    @include t-container;
    max-width: 820px;
  }

  &__head { text-align: center; margin-bottom: clamp(24px, 3.5vw, 40px); }

  &__title {
    margin: 0;
    font-size: clamp(1.375rem, 1.1rem + 1.2vw, 30px);
    font-weight: $fw-semibold;
    line-height: 1.35;
    color: $c-white;
  }

  &__accent { color: $c-tan-500; }

  &__sub {
    margin: 10px 0 0;
    font-size: clamp(1rem, 0.95rem + 0.2vw, 18px);
    line-height: 1.5;
    color: rgba($c-white, 0.78);
  }

  // Карточка: форма отделена от фона, чтобы поля не «висели» в пустоте
  &__card {
    padding: clamp(20px, 3.5vw, 40px);
    background: rgba($c-green-900, 0.4);
    border: 1px solid rgba($c-white, 0.16);
  }

  &__form { display: grid; gap: clamp(18px, 2.5vw, 26px); }

  &__ways { border: 0; padding: 0; margin: 0; }

  &__legend {
    padding: 0;
    margin-bottom: 12px;
    font-size: clamp(1rem, 0.95rem + 0.2vw, 17px);
    line-height: 1.4;
    color: $c-white;
  }

  // Таблетки тянутся на всю ширину поровну, пока помещаются
  &__chips {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;

    @media (min-width: 560px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  &__chip { @include chip; }

  // Поле и кнопка стоят в одну строку, на телефоне — друг под другом
  &__row {
    display: grid;
    gap: 12px;

    @media (min-width: 620px) {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: stretch;
    }
  }

  &__input {
    width: 100%;
    min-height: 58px;
    padding: 0 18px;
    font-size: 16px;
    color: $c-green-900;
    background: $c-white;
    border: 1px solid transparent;
    transition: border-color $transition, box-shadow $transition;

    &::placeholder { color: rgba($c-green-900, 0.42); }

    &:focus-visible {
      outline: none;
      border-color: $c-tan-500;
      box-shadow: 0 0 0 3px rgba($c-tan-500, 0.45);
    }

    &[aria-invalid='true'] { border-color: $c-tan-400; }
  }

  &__submit {
    min-height: 58px;
    padding: 0 clamp(22px, 3vw, 38px);
    font-size: 16px;
    font-weight: $fw-semibold;
    white-space: nowrap;
    color: $c-green-900;
    background: $c-tan-500;
    transition: background-color $transition, transform $transition;
    @include focus-ring($c-mint-300);

    &:hover:not(:disabled) { background: $c-tan-400; }
    &:active:not(:disabled) { transform: translateY(1px); }
    &:disabled { opacity: 0.7; cursor: default; }
  }

  &__trap { position: absolute; left: -9999px; }

  &__err {
    margin: 0;
    font-size: 14px;
    line-height: 1.45;
    color: $c-tan-400;
  }

  &__consent {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: rgba($c-white, 0.62);

    a {
      color: rgba($c-white, 0.82);
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover { color: $c-white; }
    }
  }

  // Состояние «отправлено» занимает место формы, поэтому блок не схлопывается
  &__done {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding-block: clamp(20px, 4vw, 44px);
    text-align: center;
  }

  &__done-mark {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    margin-bottom: 6px;
    color: $c-green-900;
    background: $c-mint-300;
    border-radius: 50%;
  }

  &__done-title {
    margin: 0;
    font-size: clamp(1.125rem, 1rem + 0.5vw, 22px);
    font-weight: $fw-semibold;
    color: $c-white;
  }

  &__done-text { margin: 0; font-size: 16px; color: rgba($c-white, 0.78); }
}

@media (prefers-reduced-motion: reduce) {
  .cf__submit { transition: none; }
}
</style>
