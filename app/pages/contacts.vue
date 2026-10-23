<script setup lang="ts">
import { ADDRESS, PHONE_DISPLAY, PHONE_HREF, EMAIL, WORK_HOURS, LEGAL, MESSENGERS, COMPANY } from '~/data/site'

useSeo({
  title: `Контакты — производство клееного бруса в ${ADDRESS.city}`,
  description: `Адрес производства: ${ADDRESS.full}. Телефон ${PHONE_DISPLAY}, почта ${EMAIL}. Приезжайте на экскурсию по производству.`,
})

// Карта по адресу. Когда появятся координаты (см. ADDRESS в data/site.ts),
// лучше заменить на точку — поиск по строке иногда ставит метку неточно.
const mapQuery = encodeURIComponent(`${ADDRESS.city}, ${ADDRESS.street}`)
const mapSrc = `https://yandex.ru/map-widget/v1/?text=${mapQuery}&z=16`
const mapLink = `https://yandex.ru/maps/?text=${mapQuery}`
</script>

<template>
  <article class="contacts">
    <div class="contacts__inner">
      <h1 class="contacts__title">Контакты</h1>
      <p class="contacts__lead">
        Производство открыто для гостей — приезжайте посмотреть, как мы клеим брус,
        и оцените геометрию на готовом домокомплекте.
      </p>

      <div class="contacts__grid">
        <section class="card">
          <h2 class="card__title">Производство</h2>
          <dl class="card__list">
            <dt>Адрес</dt>
            <dd>{{ ADDRESS.full }}</dd>
            <dt>Телефон</dt>
            <dd><a :href="`tel:${PHONE_HREF}`">{{ PHONE_DISPLAY }}</a></dd>
            <dt>Почта</dt>
            <dd><a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a></dd>
            <dt>Режим работы</dt>
            <dd>{{ WORK_HOURS.text }}</dd>
          </dl>

          <ul class="card__messengers" role="list">
            <li v-for="m in MESSENGERS" :key="m.id">
              <BaseButton :href="m.href" variant="ghost">{{ m.label }}</BaseButton>
            </li>
          </ul>
        </section>

        <section class="card">
          <h2 class="card__title">Реквизиты</h2>
          <dl class="card__list">
            <dt>Наименование</dt>
            <dd>{{ LEGAL.name }}</dd>
            <dt>ИНН</dt>
            <dd>{{ LEGAL.inn }}</dd>
            <template v-if="LEGAL.ogrnip">
              <dt>ОГРНИП</dt>
              <dd>{{ LEGAL.ogrnip }}</dd>
            </template>
          </dl>
          <p class="card__note">
            {{ COMPANY.name }} работает с {{ COMPANY.foundedYear }} года.
            Не является публичной офертой — цены уточняйте по телефону.
          </p>
        </section>
      </div>

      <section class="contacts__map">
        <h2 class="visually-hidden">Карта проезда</h2>
        <!-- Карта грузится отложенно: она весит больше всей страницы -->
        <iframe
          :src="mapSrc"
          class="contacts__map-frame"
          title="Карта: производство Вологда Брус"
          loading="lazy"
          allowfullscreen
        />
        <p class="contacts__map-link">
          <a :href="mapLink" target="_blank" rel="noopener noreferrer">Открыть в Яндекс.Картах →</a>
        </p>
      </section>
    </div>
  </article>
</template>

<style scoped lang="scss">
.contacts {
  @include section-padding;

  &__inner { @include container; }

  &__title { margin-bottom: $space-sm; }

  &__lead { max-width: 60ch; margin-bottom: clamp($space-lg, 4vw, $space-xl); font-size: $fs-lead; color: $c-text-muted; }

  &__grid {
    display: grid;
    gap: $space-md;
    margin-bottom: clamp($space-lg, 4vw, $space-xl);

    @include up(md) { grid-template-columns: 1.2fr 1fr; }
  }

  &__map { border-radius: $radius-md; overflow: hidden; }

  &__map-frame {
    display: block;
    width: 100%;
    height: clamp(280px, 42vw, 440px);
    border: 0;
  }

  &__map-link {
    margin-top: $space-xs;
    font-size: $fs-small;

    a { color: $c-green-800; font-weight: $fw-semibold; text-decoration: underline; text-underline-offset: 2px; }
  }
}

.card {
  padding: clamp($space-md, 2.5vw, $space-lg);
  background: $c-cream;
  border-radius: $radius-md;

  &__title { margin-bottom: $space-md; font-size: $fs-h4; }

  &__list {
    display: grid;
    gap: 4px $space-md;
    margin: 0;
    grid-template-columns: minmax(110px, auto) 1fr;
    font-size: $fs-small;

    dt { color: $c-text-muted; }
    dd { margin: 0; font-weight: $fw-medium; }
    a { color: $c-green-800; text-decoration: underline; text-underline-offset: 2px; }
  }

  &__messengers { display: flex; flex-wrap: wrap; gap: $space-xs; margin: $space-md 0 0; padding: 0; list-style: none; }

  &__note { margin-top: $space-md; font-size: $fs-xs; color: $c-text-muted; line-height: 1.6; }
}
</style>
