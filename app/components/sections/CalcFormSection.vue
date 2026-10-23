<script setup lang="ts">
import { CALC_FORM } from '~/data/content'
import { MESSENGERS } from '~/data/site'

const { state, errorText, submit } = useLeadForm()
const WAYS = ['Телефон', ...MESSENGERS.map(m => m.label)] as const

const form = reactive({ name: '', contact: '', way: WAYS[0] as string })
const honeypot = ref('')
const errors = reactive<Record<string, string>>({})

function validate() {
  errors.contact = form.contact.trim().length < 5 ? 'Укажите телефон или ник' : ''
  return !errors.contact
}
async function onSubmit() {
  if (!validate()) return
  await submit({ formName: 'Расчёт стоимости и скидка 10%', ...form }, honeypot.value)
}
</script>

<template>
  <section id="calc" class="cf">
    <div class="cf__inner">
    <div class="cf__head">
      <h2 class="cf__l1">{{ CALC_FORM.title }}</h2>
      <p class="cf__l2">и <span>скидку 10%</span> на его строительство</p>
      <p class="cf__l3">под контролем производителя</p>
    </div>

    <div v-if="state === 'done'" class="cf__done" role="status">
      Заявка отправлена — свяжемся в течение рабочего дня.
    </div>

    <form v-else class="cf__form" novalidate @submit.prevent="onSubmit">
      <fieldset class="cf__ways">
        <legend class="cf__legend">{{ CALC_FORM.contactLabel }}</legend>
        <label v-for="w in WAYS" :key="w" class="cf__way">
          <input v-model="form.way" type="radio" name="way" :value="w">
          <span>{{ w }}</span>
        </label>
      </fieldset>

      <input
        v-model="form.contact" class="cf__input" type="tel" name="contact"
        autocomplete="tel" placeholder="+7" :aria-label="'Телефон или ник'"
        :aria-invalid="!!errors.contact || undefined"
      >
      <div class="cf__trap" aria-hidden="true">
        <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off">
      </div>
      <button type="submit" class="cf__submit">
        {{ state === 'sending' ? 'Отправляем…' : CALC_FORM.submit }}
      </button>
      <p v-if="errors.contact || state === 'error'" class="cf__err" role="alert">
        {{ errors.contact || errorText }}
      </p>

      <p class="cf__consent">
        Нажимая на кнопку, вы даёте согласие на обработку персональных данных и соглашаетесь с
        <NuxtLink to="/privacy-policy">политикой конфиденциальности</NuxtLink>
      </p>
    </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cf {
  &__head { color: $c-white; margin-bottom: $space-md; }
  &__l1, &__l2, &__l3 { font-size: clamp(1.125rem, 1rem + 0.9vw, 26px); font-weight: $fw-regular; line-height: 30px; color: $c-white; }
  &__l2 span { color: $c-tan-500; }

  &__legend { font-size: 18px; line-height: 27.9px; color: $c-white; margin-bottom: $space-xs; }
  &__ways { border: 0; padding: 0; margin: 0 0 $space-sm; display: flex; flex-wrap: wrap; gap: 6px; }

  &__way {
    position: relative;
    cursor: pointer;

    input { position: absolute; opacity: 0; }
    span {
      display: block;
      padding: 9px 16px;
      font-size: 14px;
      line-height: 21.7px;
      color: $c-white;
      border: 1px solid rgba($c-white, 0.35);
    }
    input:checked + span { border-color: $c-white; background: rgba($c-white, 0.12); }
    input:focus-visible + span { outline: 2px solid $c-mint-300; outline-offset: 2px; }
  }

  &__input {
    width: 100%;
    max-width: 332px;
    height: 60px;
    padding: 0 18px;
    font-size: 16px;
    background: $c-white;
    border: 0;
  }

  &__trap { position: absolute; left: -9999px; }

  &__submit {
    margin-top: $space-sm;
    padding: 18px 28px;
    font-size: 16px;
    font-weight: $fw-semibold;
    color: $c-white;
    background: $c-brown-500;
    @include focus-ring($c-mint-300);

    &:hover { background: $c-tan-500; }
  }

  &__err { margin-top: $space-xs; font-size: 14px; color: $c-tan-400; }
  &__done { padding: $space-lg 0; font-size: 20px; color: $c-white; }

  &__consent {
    margin-top: $space-md;
    font-size: 14px;
    line-height: 21.7px;
    color: $c-white;

    a { color: $c-tan-400; text-decoration: underline; text-underline-offset: 2px; }
  }

  // Колонка формы стоит по центру блока
  &__inner {
    @include t-container;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__ways, &__submit, &__input { align-self: center; }
  &__ways { justify-content: center; }
  &__consent { max-width: 56ch; }

  background: $c-green-800;
  padding-block: clamp(40px, 6vw, 115px) clamp(40px, 5vw, 80px);
}
</style>
