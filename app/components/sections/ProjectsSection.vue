<script setup lang="ts">
import { PROJECTS } from '~/data/content'

/**
 * Проекты: вкладки, крупный кадр и миниатюры под ним.
 *
 * Раскладка как в оригинале: слева большая фотография, справа описание,
 * под фотографией лента миниатюр. Миниатюра переключает крупный кадр,
 * клик по крупному кадру открывает снимок во весь экран.
 *
 * Фиксированных координат здесь нет: ширины заданы долями сетки, высота
 * растёт по содержимому. Поэтому длинный текст проекта не наезжает на
 * соседние блоки, а на узком экране колонки просто встают друг под друга.
 */
const activeId = ref(PROJECTS.items[0]!.id)
const tabRefs = ref<HTMLButtonElement[]>([])
const active = computed(() => PROJECTS.items.find(p => p.id === activeId.value)!)
const activeIndex = computed(() => PROJECTS.items.findIndex(p => p.id === activeId.value))

/** Какой снимок показан крупно. Сбрасывается при смене проекта. */
const shot = ref(0)
watch(activeId, () => { shot.value = 0 })

/** Номер снимка в полноэкранном окне, -1 — окно закрыто. */
const zoom = ref(-1)

function goTab(delta: number) {
  const n = PROJECTS.items.length
  activeId.value = PROJECTS.items[(activeIndex.value + delta + n) % n]!.id
}

function onTabKey(e: KeyboardEvent, index: number) {
  const n = PROJECTS.items.length
  let next: number | null = null
  if (e.key === 'ArrowRight') next = (index + 1) % n
  else if (e.key === 'ArrowLeft') next = (index - 1 + n) % n
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = n - 1
  if (next === null) return
  e.preventDefault()
  activeId.value = PROJECTS.items[next]!.id
  tabRefs.value[next]?.focus()
}
</script>

<template>
  <section id="projects" class="pj">
    <div class="pj__inner">
      <h2 class="pj__title">{{ PROJECTS.kicker }}</h2>

      <div class="pj__bar">
        <button type="button" class="pj__arrow" aria-label="Предыдущий проект" @click="goTab(-1)">
          <svg viewBox="0 0 17 28" width="17" height="28" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M15 2 3 14l12 12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div class="pj__tabs" role="tablist" aria-label="Наши проекты">
          <button
            v-for="(p, i) in PROJECTS.items"
            :id="`tab-${p.id}`"
            :key="p.id"
            ref="tabRefs"
            type="button"
            role="tab"
            class="pj__tab"
            :class="{ 'pj__tab--active': p.id === activeId }"
            :aria-selected="p.id === activeId"
            :tabindex="p.id === activeId ? 0 : -1"
            :aria-controls="`panel-${p.id}`"
            @click="activeId = p.id"
            @keydown="onTabKey($event, i)"
          >
            {{ p.tab }}
          </button>
        </div>

        <button type="button" class="pj__arrow" aria-label="Следующий проект" @click="goTab(1)">
          <svg viewBox="0 0 17 28" width="17" height="28" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="m2 2 12 12L2 26" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div
        :id="`panel-${active.id}`"
        class="pj__panel"
        role="tabpanel"
        :aria-labelledby="`tab-${active.id}`"
        tabindex="0"
      >
        <div v-if="active.gallery.length" class="pj__media">
          <button
            type="button"
            class="pj__hero"
            :aria-label="`Открыть фото ${shot + 1} во весь экран`"
            @click="zoom = shot"
          >
            <SmartImage
              :key="active.gallery[shot]"
              :name="active.gallery[shot]!"
              :alt="`${active.title} — фото ${shot + 1}`"
              cover
              sizes="(min-width: 1024px) 62vw, 100vw"
            />
          </button>

          <ul v-if="active.gallery.length > 1" class="pj__thumbs" role="list">
            <li v-for="(g, i) in active.gallery" :key="g">
              <button
                type="button"
                class="pj__thumb"
                :class="{ 'pj__thumb--active': i === shot }"
                :aria-label="`Показать фото ${i + 1}`"
                :aria-current="i === shot ? 'true' : undefined"
                @click="shot = i"
              >
                <SmartImage :name="g" :alt="''" cover sizes="110px" />
              </button>
            </li>
          </ul>
        </div>

        <div class="pj__text">
          <h3 class="pj__name">{{ active.title }}</h3>
          <p v-if="active.subtitle" class="pj__sub">{{ active.subtitle }}</p>
          <p v-for="(para, i) in active.paragraphs" :key="i" class="pj__para">{{ para }}</p>
        </div>
      </div>
    </div>

    <Lightbox
      :images="active.gallery"
      :index="zoom"
      :caption="active.title"
      @close="zoom = -1"
      @update:index="zoom = $event"
    />
  </section>
</template>

<style scoped lang="scss">
.pj {
  background: $c-white;
  padding-block: clamp(40px, 6vw, 76px) clamp(40px, 5vw, 64px);

  &__inner { @include t-container; }

  &__title {
    margin: 0 0 clamp(20px, 3vw, 36px);
    font-size: clamp(1.5rem, 1.2rem + 1.2vw, 32px);
    font-weight: $fw-medium;
    line-height: 1.3;
    text-align: center;
  }

  // Полоса вкладок: стрелки по краям, вкладки по центру, линия снизу
  &__bar {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: clamp(4px, 1.5vw, 16px);
    padding-bottom: 10px;
    border-bottom: 2px solid $c-tan-500;
    margin-bottom: clamp(24px, 3vw, 40px);
  }

  &__arrow {
    flex: none;
    display: grid;
    place-items: center;
    width: 32px;
    color: $c-brown-700;
    transition: color $transition;
    @include focus-ring;

    &:hover { color: $c-green-800; }
  }

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px clamp(4px, 1.2vw, 14px);
    min-width: 0;
  }

  &__tab {
    padding: 10px 12px;
    font-size: clamp(0.8125rem, 0.78rem + 0.2vw, 14px);
    font-weight: $fw-semibold;
    line-height: 1.3;
    text-align: center;
    color: $c-brown-700;
    border: 1px solid transparent;
    transition: color $transition, border-color $transition;
    @include focus-ring;

    &:hover { color: $c-green-800; }
    &--active { color: $c-green-800; border-color: $c-tan-500; }
  }

  // Две колонки на широком экране, одна на узком
  &__panel {
    display: grid;
    gap: clamp(20px, 3vw, 40px);
    @include focus-ring;

    @include up(lg) {
      grid-template-columns: minmax(0, 1.9fr) minmax(260px, 1fr);
      align-items: start;
    }
  }

  &__media { min-width: 0; }

  &__hero {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    background: $c-sand;
    cursor: zoom-in;
    @include focus-ring;

    :deep(picture) { display: block; width: 100%; height: 100%; }

    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &:hover :deep(img) { transform: scale(1.02); }
  }

  &__thumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  &__thumb {
    display: block;
    width: clamp(64px, 9vw, 96px);
    aspect-ratio: 3 / 2;
    overflow: hidden;
    background: $c-sand;
    opacity: 0.65;
    outline-offset: 2px;
    transition: opacity $transition, box-shadow $transition;
    @include focus-ring;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }

    &:hover { opacity: 1; }
    &--active { opacity: 1; box-shadow: inset 0 0 0 2px $c-green-800; }
  }

  &__text { min-width: 0; }

  &__name {
    margin: 0;
    font-size: clamp(1.125rem, 1rem + 0.5vw, 22px);
    font-weight: $fw-semibold;
    line-height: 1.35;
    color: $c-brown-900;
  }

  &__sub {
    margin: 12px 0 0;
    font-size: clamp(1rem, 0.95rem + 0.3vw, 18px);
    line-height: 1.5;
    color: $c-brown-900;
  }

  &__para {
    margin: 14px 0 0;
    font-size: clamp(0.9375rem, 0.9rem + 0.2vw, 16px);
    line-height: 1.55;
    color: rgba($c-brown-900, 0.85);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pj__hero :deep(img) { transition: none; }
  .pj__hero:hover :deep(img) { transform: none; }
}
</style>
