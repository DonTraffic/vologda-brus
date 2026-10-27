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
  <ZeroStage id="consult" :height="900" bg="#fcf8f4">
    <h2 class="cs__title">{{ CONSULT_FORM.title }}</h2>
    <p class="cs__sub">{{ CONSULT_FORM.subtitle }}</p>

    <div v-if="state === 'done'" class="cs__done" role="status">
      <p>Вопрос отправлен.</p>
      <p>{{ CONSULT_FORM.note }}</p>
    </div>

    <form v-else class="cs__form" novalidate @submit.prevent="onSubmit">
      <label class="cs__lbl cs__lbl--name" for="cs-name">Ваше имя</label>
      <input id="cs-name" v-model="form.name" class="cs__in cs__in--name" name="name" autocomplete="name">

      <fieldset class="cs__set cs__set--way">
        <legend class="cs__lbl">Удобный способ связи</legend>
        <label v-for="w in WAYS" :key="w" class="cs__radio">
          <input v-model="form.way" type="radio" name="way" :value="w"><span>{{ w }}</span>
        </label>
      </fieldset>

      <fieldset class="cs__set cs__set--expert">
        <legend class="cs__lbl">{{ CONSULT_FORM.expertLabel }}</legend>
        <p class="cs__hint">{{ CONSULT_FORM.expertHint }}</p>
        <label v-for="o in CONSULT_FORM.expertOptions" :key="o" class="cs__radio">
          <input v-model="form.expert" type="radio" name="expert" :value="o"><span>{{ o }}</span>
        </label>
      </fieldset>

      <label class="cs__lbl cs__lbl--q" for="cs-q">Ваш вопрос</label>
      <textarea id="cs-q" v-model="form.question" class="cs__in cs__in--q" name="question" placeholder="Хотел бы узнать…" />

      <div class="cs__trap" aria-hidden="true"><input v-model="honeypot" type="text" tabindex="-1" autocomplete="off"></div>

      <button type="submit" class="cs__submit">{{ state === 'sending' ? 'Отправляем…' : 'Отправить' }}</button>

      <p v-if="errors.name || errors.question || state === 'error'" class="cs__err" role="alert">
        {{ errors.name || errors.question || errorText }}
      </p>

      <p class="cs__note">
        {{ CONSULT_FORM.note }}<br>
        Нажимая на кнопку, вы соглашаетесь с
        <NuxtLink to="/privacy-policy/">политикой конфиденциальности</NuxtLink>
      </p>
    </form>
  </ZeroStage>
</template>

<style scoped lang="scss">
.cs {
  // Содержимое блока выровнено по центру — и сама колонка, и текст в ней
  text-align: center;

  &__title { font-size: clamp(1.75rem, 1.4rem + 1.8vw, 42px); line-height: 1.26; }
  &__sub { font-size: 18px; line-height: 28px; margin-bottom: $space-lg; }

  &__form { display: flex; flex-direction: column; gap: 10px; }
  &__lbl { font-size: 16px; }
  &__hint { font-size: 12px; line-height: 18.6px; color: $c-text-muted; margin-bottom: 6px; }

  &__in {
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    line-height: 18.62px;
    color: #3e3e3e;
    background: transparent;
    border: 1px solid $c-green-800;

    &:focus { outline: 2px solid $c-green-800; outline-offset: 1px; }
  }
  &__in--q { min-height: 110px; resize: vertical; }

  &__set { border: 0; padding: 0; margin: 0; }

  &__radio {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 6px 0;
    font-size: 14px;
    line-height: 16.8px;
    cursor: pointer;

    input { accent-color: $c-green-800; }
  }

  &__trap { position: absolute; left: -9999px; }

  &__submit {
    width: 250px;
    height: 50px;
    margin-inline: auto;
    font-size: 15px;
    color: $c-white;
    background: $c-green-800;
    @include focus-ring;

    &:hover { background: $c-green-900; }
  }

  &__err { font-size: 13px; color: #b4342a; }

  &__note {
    font-size: 12px;
    line-height: 19px;
    color: $c-text-muted;

    a { color: $c-brown-700; text-decoration: underline; text-underline-offset: 2px; }
  }

  &__done { font-size: 18px; line-height: 28px; }

  @include up(lg) {
    &__title { @include place((x: 230px, y: 50px, w: 740px, h: 53px)); font-size: 42px; }
    &__sub   { @include place((x: 230px, y: 128px, w: 740px, h: 28px)); margin: 0; }

    &__form { display: contents; }

    &__lbl--name { position: absolute; left: 230px; top: 181px; width: 740px; }
    &__in--name  { position: absolute; left: 230px; top: 208px; width: 740px; height: 50px; }

    &__set--way    { position: absolute; left: 230px; top: 278px; width: 740px; }
    &__set--expert { position: absolute; left: 230px; top: 383px; width: 740px; }

    &__lbl--q { position: absolute; left: 230px; top: 561px; width: 740px; }
    &__in--q  { position: absolute; left: 230px; top: 588px; width: 740px; height: 110px; min-height: 0; }

    &__submit { position: absolute; left: 475px; top: 718px; }
    &__err    { position: absolute; left: 230px; top: 775px; width: 740px; }
    &__note   { position: absolute; left: 230px; top: 793px; width: 560px; }
    &__done   { position: absolute; left: 230px; top: 200px; width: 740px; }
  }
}
</style>
