<script setup lang="ts">
import { POLICY_PARTS, POLICY_OPERATOR } from '~/data/policy'
import { EMAIL } from '~/data/site'

useSeo({
  // На Тильде заголовок этой страницы — «политика конф», с маленькой буквы
  // и с обрезанным словом.
  title: 'Политика конфиденциальности',
  description:
    'Как Вологда Брус обрабатывает и защищает персональные данные посетителей сайта в соответствии с 152-ФЗ.',
})

const config = useRuntimeConfig()
const site = (config.public.siteUrl as string).replace(/\/$/, '')

/** Подставляем актуальный адрес сайта вместо метки в тексте документа. */
const render = (t: string) => t.replace(/\{\{SITE\}\}/g, site)
</script>

<template>
  <article class="policy">
    <div class="policy__inner">
      <h1 class="policy__title">Политика конфиденциальности</h1>

      <!--
        Оператор берётся из самого документа, а не из реквизитов компании:
        в тексте политики назван другой предприниматель — см. пометку
        в app/data/policy.ts.
      -->
      <p class="policy__meta">
        Оператор: {{ POLICY_OPERATOR.name }}, ИНН {{ POLICY_OPERATOR.inn }}<span v-if="POLICY_OPERATOR.ogrnip">, ОГРНИП {{ POLICY_OPERATOR.ogrnip }}</span>.
        Вопросы по обработке данных — <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>.
      </p>

      <div class="policy__body">
        <template v-for="(part, i) in POLICY_PARTS" :key="i">
          <h2 v-if="part.type === 'h'" class="policy__h">{{ render(part.text) }}</h2>
          <li v-else-if="part.type === 'li'" class="policy__li">{{ render(part.text) }}</li>
          <p v-else class="policy__p">{{ render(part.text) }}</p>
        </template>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.policy {
  @include section-padding;

  &__inner { @include t-container; }

  &__title { margin-bottom: $space-md; }

  &__meta {
    margin-bottom: $space-lg;
    padding: $space-sm $space-md;
    font-size: $fs-small;
    background: $c-mint-100;
    border-radius: $radius-sm;
    border-left: 4px solid $c-green-800;

    a { color: $c-green-800; text-decoration: underline; text-underline-offset: 2px; }
  }

  &__body { display: flex; flex-direction: column; gap: 10px; }

  &__h {
    margin-top: $space-lg;
    font-size: $fs-h4;
  }

  &__p { font-size: $fs-small; line-height: 1.65; color: $c-text; }

  &__li {
    margin-left: $space-md;
    font-size: $fs-small;
    line-height: 1.65;
    list-style: none;
  }
}
</style>
