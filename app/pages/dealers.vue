<script setup lang="ts">
import { BINDER } from '~/data/content'
import { PHONE_DISPLAY, PHONE_HREF } from '~/data/site'

// Отдельная страница под оптовое направление. На действующих сайтах её нет
// ни на одном, хотя предложение проработано: биндер, домокомплекты «под
// проект» и «в проекте», партии от 10 м³. По оптовым запросам компания
// в поиске не представлена вовсе.
useSeo({
  title: 'Клееный брус и домокомплекты оптом — для дилеров и производителей',
  description:
    'Биндер клееный и домокомплекты «под проект» и «в проекте» с чашами. Партии от 10 м³, японский клей OSHIKA, геометрия ±0,5 мм, собственная сушка. Условия для дилеров.',
  image: 'binder',
})

const { open: openMessengers } = useMessengerModal()

const OFFERS = [
  {
    title: 'Биндер клееный',
    text: 'Заготовка клееного бруса для вашего производства. Собственная сушка, японский клей, точность ±0,5 мм.',
    meta: 'от 10 м³',
  },
  {
    title: 'Домокомплект «под проект»',
    text: 'Изготовим по вашему проекту: торцовка в размер, зарезка чаш, маркировка по проекту.',
    meta: 'по чертежам',
  },
  {
    title: 'Домокомплект «в проекте»',
    text: 'Подберём типовое решение из наших проектов и изготовим домокомплект под него.',
    meta: 'типовые решения',
  },
  {
    title: 'Клееная балка',
    text: 'Для перекрытий и несущих конструкций. Сечения под расчёт нагрузки.',
    meta: 'под расчёт',
  },
]

const WHY = [
  'Полный цикл: своя лесозаготовка, сушка, склейка и обработка на одной площадке',
  'Клеевая система OSHIKA — сертификат на клей предоставляем',
  'Геометрия ±0,5 мм: домокомплект собирается без подгонки на объекте',
  'Фиксированная смета и место в графике производства под аванс',
]
</script>

<template>
  <article class="dealers">
    <section class="dealers__hero">
      <div class="dealers__hero-inner">
        <div class="dealers__hero-body">
          <p class="dealers__kicker">Оптовое направление</p>
          <h1 class="dealers__title">Клееный брус и домокомплекты для дилеров</h1>
          <p class="dealers__lead">
            Производим биндер и готовые домокомплекты на своём заводе в Вологде.
            Работаем с застройщиками, производителями и дилерами.
          </p>
          <div class="dealers__actions">
            <!-- Ссылка на форму внизу страницы, окно мессенджеров — поверх -->
            <BaseButton href="#consult" variant="primary" size="lg" @click.prevent="openMessengers()">
              Запросить условия
            </BaseButton>
            <BaseButton :href="`tel:${PHONE_HREF}`" variant="ghost" size="lg" class="dealers__phone">
              {{ PHONE_DISPLAY }}
            </BaseButton>
          </div>
        </div>

        <div class="dealers__hero-media">
          <SmartImage
            :name="BINDER.image"
            alt="Биндер клееный на производстве в Вологде"
            priority
            cover
            sizes="(min-width: 1024px) 48vw, 100vw"
          />
        </div>
      </div>
    </section>

    <section class="dealers__block">
      <div class="dealers__inner">
        <SectionHeader title="Что поставляем" />
        <ul class="offers" role="list">
          <li v-for="o in OFFERS" :key="o.title" class="offer">
            <p class="offer__meta">{{ o.meta }}</p>
            <h3 class="offer__title">{{ o.title }}</h3>
            <p class="offer__text">{{ o.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="dealers__block dealers__block--alt">
      <div class="dealers__inner">
        <SectionHeader title="Почему с нами выгодно" />
        <ul class="why" role="list">
          <li v-for="w in WHY" :key="w" class="why__item">{{ w }}</li>
        </ul>
      </div>
    </section>

    <SectionsConsultFormSection />
  </article>
</template>

<style scoped lang="scss">
.dealers {
  &__hero {
    background: $c-green-900;
    color: $c-white;
  }

  &__hero-inner {
    @include container;
    display: grid;
    gap: clamp($space-lg, 4vw, $space-xl);
    align-items: center;
    padding-block: clamp($space-xl, 7vw, 120px);

    @include up(lg) { grid-template-columns: 1fr 1fr; }
  }

  &__hero-body { display: flex; flex-direction: column; gap: $space-md; align-items: start; }

  &__kicker {
    font-size: $fs-xs;
    font-weight: $fw-semibold;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $c-mint-300;
  }

  &__title { margin: 0; color: $c-white; max-width: 22ch; }

  &__lead { max-width: 48ch; font-size: $fs-lead; color: rgba($c-white, 0.84); }

  &__actions { display: flex; flex-wrap: wrap; gap: $space-xs; }

  &__phone { color: $c-white; }

  &__hero-media {
    overflow: hidden;
    border-radius: $radius-md;
    aspect-ratio: 4 / 3;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__block {
    @include section-padding;
    &--alt { background: $c-cream; }
  }

  &__inner { @include container; }
}

.offers {
  @include auto-grid(260px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.offer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: $space-md;
  background: $c-cream;
  border-radius: $radius-md;

  &__meta {
    font-size: $fs-xs;
    font-weight: $fw-semibold;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $c-accent-hover;
  }

  &__title { margin: 0; font-size: $fs-h4; }

  &__text { font-size: $fs-small; color: $c-text-muted; line-height: 1.55; }
}

.why {
  display: grid;
  gap: $space-sm;
  margin: 0;
  padding: 0;
  list-style: none;

  @include up(md) { grid-template-columns: repeat(2, 1fr); }

  &__item {
    position: relative;
    padding: $space-sm $space-md $space-sm 44px;
    font-size: $fs-lead;
    line-height: 1.45;
    background: $c-white;
    border-radius: $radius-md;

    &::before {
      content: '';
      position: absolute;
      left: 18px;
      top: 1.5em;
      width: 14px;
      height: 2px;
      background: $c-accent;
    }
  }
}
</style>
