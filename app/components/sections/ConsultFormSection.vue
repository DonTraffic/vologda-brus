<script setup lang="ts">
import { CONSULT_FORM } from '~/data/content'
import { MESSENGERS } from '~/data/site'

const { state, errorText, submit } = useLeadForm()
const WAYS = MESSENGERS.filter(m => m.id !== 'telegram').map(m => m.label)

const form = reactive({
  name: '', contact: '', way: WAYS[0] as string,
  expert: CONSULT_FORM.expertOptions[2] as string, question: '',
})
const honeypot = ref('')
const errors = reactive<Record<string, string>>({})

function validate() {
  errors.name = form.name.trim().length < 2 ? 'Укажите имя' : ''
  errors.question = form.question.trim().length < 5 ? 'Напишите, что хотите узнать' : ''
  return !errors.name && !errors.question
}
async function onSubmit() {
  if (!validate()) return
  await submit({ formName: 'Консультация эксперта', ...form }, honeypot.value, GOALS.formConsult)
}
</script>

<template>
  <section id="consult" class="cs">
    <div class="cs__inner">
      <header class="cs__head">
        <h2 class="cs__title">{{ CONSULT_FORM.title }}</h2>
        <p class="cs__sub">{{ CONSULT_FORM.subtitle }}</p>
      </header>

      <div class="cs__card">
        <div v-if="state === 'done'" class="cs__done" role="status">
          <span class="cs__done-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m4 12.5 5.5 5.5L20 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <p class="cs__done-title">Вопрос отправлен</p>
          <p class="cs__done-text">{{ CONSULT_FORM.note }}</p>
        </div>

        <form v-else class="cs__form" novalidate @submit.prevent="onSubmit">
          <div class="cs__field">
            <label class="cs__lbl" for="cs-name">Ваше имя</label>
            <input
              id="cs-name" v-model="form.name" class="cs__in" name="name" autocomplete="name"
              placeholder="Как к вам обращаться" :aria-invalid="!!errors.name || undefined"
            >
          </div>

          <fieldset class="cs__field cs__field--set">
            <legend class="cs__lbl">Удобный способ связи</legend>
            <div class="cs__chips cs__chips--way">
              <label v-for="w in WAYS" :key="w" class="cs__chip">
                <input v-model="form.way" type="radio" name="way" :value="w"><span>{{ w }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset class="cs__field cs__field--set">
            <legend class="cs__lbl">{{ CONSULT_FORM.expertLabel }}</legend>
            <p class="cs__hint">{{ CONSULT_FORM.expertHint }}</p>
            <div class="cs__chips cs__chips--expert">
              <label v-for="o in CONSULT_FORM.expertOptions" :key="o" class="cs__chip">
                <input v-model="form.expert" type="radio" name="expert" :value="o"><span>{{ o }}</span>
              </label>
            </div>
          </fieldset>

          <div class="cs__field">
            <label class="cs__lbl" for="cs-q">Ваш вопрос</label>
            <textarea
              id="cs-q" v-model="form.question" class="cs__in cs__in--area" name="question"
              placeholder="Хотел бы узнать…" :aria-invalid="!!errors.question || undefined"
            />
          </div>

          <div class="cs__trap" aria-hidden="true">
            <input v-model="honeypot" type="text" tabindex="-1" autocomplete="off">
          </div>

          <p v-if="errors.name || errors.question || state === 'error'" class="cs__err" role="alert">
            {{ errors.name || errors.question || errorText }}
          </p>

          <div class="cs__foot">
            <button type="submit" class="cs__submit" :disabled="state === 'sending'">
              {{ state === 'sending' ? 'Отправляем…' : CONSULT_FORM.submit }}
            </button>
            <p class="cs__note">
              {{ CONSULT_FORM.note }}<br>
              Нажимая на кнопку, вы даёте согласие на обработку персональных данных
              и соглашаетесь с <NuxtLink to="/privacy-policy/">политикой конфиденциальности</NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cs {
  background: $c-cream;
  padding-block: clamp(48px, 7vw, 100px);

  // Цвета таблеток на светлом фоне
  --chip-fg: #{$c-brown-900};
  --chip-bg: #{$c-white};
  --chip-bd: #{rgba($c-brown-900, 0.2)};
  --chip-fg-on: #{$c-white};
  --chip-bg-on: #{$c-green-800};
  --chip-bd-on: #{$c-green-800};
  --chip-ring: #{$c-green-800};

  &__inner {
    @include t-container;
    max-width: 760px;
  }

  &__head { text-align: center; margin-bottom: clamp(24px, 3.5vw, 40px); }

  &__title {
    margin: 0;
    font-size: clamp(1.75rem, 1.4rem + 1.8vw, 42px);
    font-weight: $fw-semibold;
    line-height: 1.2;
    color: $c-brown-700;
  }

  &__sub {
    margin: 10px 0 0;
    font-size: clamp(1rem, 0.95rem + 0.3vw, 18px);
    line-height: 1.5;
    color: $c-text-muted;
  }

  // Белая карточка на кремовом фоне: форма читается как один предмет,
  // а поля не растекаются по всей ширине экрана
  &__card {
    padding: clamp(20px, 3.5vw, 40px);
    background: $c-white;
    border: 1px solid $c-border;
    box-shadow: 0 1px 2px rgba($c-brown-900, 0.04), 0 12px 32px rgba($c-brown-900, 0.06);
  }

  &__form { display: grid; gap: clamp(18px, 2.4vw, 26px); }

  &__field { display: grid; gap: 8px; }
  &__field--set { border: 0; padding: 0; margin: 0; }

  &__lbl {
    padding: 0;
    font-size: 15px;
    font-weight: $fw-medium;
    line-height: 1.35;
    color: $c-brown-900;
  }

  &__hint {
    margin: -2px 0 2px;
    font-size: 13px;
    line-height: 1.45;
    color: $c-text-muted;
  }

  &__in {
    width: 100%;
    min-height: 52px;
    padding: 13px 16px;
    font-size: 16px;
    line-height: 1.4;
    color: $c-brown-900;
    background: $c-white;
    border: 1px solid rgba($c-brown-900, 0.22);
    transition: border-color $transition, box-shadow $transition;

    &::placeholder { color: rgba($c-brown-900, 0.38); }

    &:focus-visible {
      outline: none;
      border-color: $c-green-800;
      box-shadow: 0 0 0 3px rgba($c-green-800, 0.16);
    }

    &[aria-invalid='true'] { border-color: #b4342a; }
  }

  &__in--area { min-height: 128px; resize: vertical; }

  // Два способа связи делим пополам, три эксперта — на три равные доли
  &__chips { display: grid; gap: 10px; }

  &__chips--way {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 360px;
  }

  &__chips--expert {
    grid-template-columns: minmax(0, 1fr);

    @media (min-width: 560px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  &__chip { @include chip; }

  &__trap { position: absolute; left: -9999px; }

  &__err {
    margin: 0;
    font-size: 14px;
    line-height: 1.45;
    color: #b4342a;
  }

  // Кнопка и примечание рядом: на узком экране кнопка во всю ширину сверху
  &__foot {
    display: grid;
    gap: 14px;
    align-items: center;
    padding-top: clamp(4px, 1vw, 10px);
    border-top: 1px solid $c-border;

    @media (min-width: 620px) {
      grid-template-columns: auto minmax(0, 1fr);
      gap: 20px;
      padding-top: clamp(14px, 2vw, 22px);
    }
  }

  &__submit {
    min-height: 54px;
    padding: 0 clamp(24px, 3vw, 40px);
    font-size: 16px;
    font-weight: $fw-semibold;
    white-space: nowrap;
    color: $c-white;
    background: $c-green-800;
    transition: background-color $transition, transform $transition;
    @include focus-ring;

    &:hover:not(:disabled) { background: $c-green-700; }
    &:active:not(:disabled) { transform: translateY(1px); }
    &:disabled { opacity: 0.7; cursor: default; }
  }

  &__note {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: $c-text-muted;

    a {
      color: $c-brown-700;
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover { color: $c-brown-500; }
    }
  }

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
    color: $c-white;
    background: $c-green-800;
    border-radius: 50%;
  }

  &__done-title {
    margin: 0;
    font-size: clamp(1.125rem, 1rem + 0.5vw, 22px);
    font-weight: $fw-semibold;
    color: $c-brown-700;
  }

  &__done-text { margin: 0; font-size: 16px; color: $c-text-muted; }
}

@media (prefers-reduced-motion: reduce) {
  .cs__submit { transition: none; }
}
</style>
