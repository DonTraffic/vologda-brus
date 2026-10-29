<script setup lang="ts">
import { EXPERTS } from '~/data/content'
import { COMPANY } from '~/data/site'
const lines = (e: typeof EXPERTS[number]) => [e.experience, ...e.duties, `«${e.quote}»`]
</script>

<template>
  <section id="experts" class="ex">
    <div class="ex__inner">
      <h2 class="ex__title">Ваш дом под контролем двух экспертов</h2>

      <ul class="ex__grid" role="list">
        <li
          v-for="(e, i) in EXPERTS" :key="e.name" class="ex__card"
          v-reveal="{ style: 'right', delay: i * 0.16 }"
        >
          <div class="ex__photo">
            <SmartImage
              :name="e.photo"
              :alt="`${e.name} — ${e.role.toLowerCase()}, ${COMPANY.name}`"
              cover
              sizes="(min-width: 1024px) 260px, 45vw"
            />
          </div>
          <div class="ex__body">
            <h3 class="ex__name">{{ e.name }}</h3>
            <p class="ex__role">{{ e.role }}</p>
            <ul class="ex__list">
              <li v-for="l in lines(e)" :key="l">{{ l }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.ex {
  background: $c-white;
  padding-block: clamp(40px, 5vw, 75px) clamp(40px, 6vw, 90px);

  &__inner { @include t-container; }

  &__title {
    font-size: clamp(1.625rem, 1.25rem + 1.6vw, 36px);
    font-weight: $fw-semibold;
    line-height: 1.23;
    color: $c-brown-900;
    margin-bottom: clamp($space-lg, 5vw, 95px);
  }

  &__grid {
    display: grid;
    gap: clamp($space-lg, 3vw, 20px);
    margin: 0; padding: 0; list-style: none;

    @include up(md) { grid-template-columns: 1fr 1fr; }
  }

  &__card {
    display: grid;
    gap: 17px;
    grid-template-columns: minmax(0, 1fr);

    @include up(xs) { grid-template-columns: minmax(120px, 260px) minmax(0, 1fr); }
  }

  &__photo {
    overflow: hidden;
    aspect-ratio: 260 / 346;
    background: $c-sand;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }

  &__name { font-size: clamp(1.25rem, 1.05rem + 0.8vw, 26px); font-weight: $fw-semibold; line-height: 1.35; color: $c-brown-900; }
  &__role { margin-top: 10px; font-size: clamp(1rem, 0.95rem + 0.4vw, 20px); line-height: 1.55; color: $c-brown-900; }

  &__list {
    margin: clamp($space-sm, 2vw, 34px) 0 0;
    padding-left: 20px;
    font-size: 15px;
    line-height: 23.25px;
    color: $c-brown-900;
  }
}
</style>
