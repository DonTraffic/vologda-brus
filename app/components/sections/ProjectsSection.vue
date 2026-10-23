<script setup lang="ts">
import { PROJECTS } from '~/data/content'

const activeId = ref(PROJECTS.items[0]!.id)
const tabRefs = ref<HTMLButtonElement[]>([])
const active = computed(() => PROJECTS.items.find(p => p.id === activeId.value)!)
const activeIndex = computed(() => PROJECTS.items.findIndex(p => p.id === activeId.value))

// Высота панели меняется от вкладки к вкладке. Чтобы страница не прыгала,
// обёртка держит измеренную высоту и доводит её до новой плавно.
const pane = ref<HTMLElement | null>(null)
const paneH = ref(0)
const boxStyle = computed(() => (paneH.value ? { height: `${paneH.value}px` } : undefined))

let ro: ResizeObserver | null = null
const measure = () => { if (pane.value) paneH.value = pane.value.offsetHeight }

onMounted(() => {
  ro = new ResizeObserver(measure)
  watchEffect(() => {
    ro?.disconnect()
    if (pane.value) ro?.observe(pane.value)
  })
})
onBeforeUnmount(() => ro?.disconnect())

function goTab(delta: number) {
  const n = PROJECTS.items.length
  const next = (activeIndex.value + delta + n) % n
  activeId.value = PROJECTS.items[next]!.id
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

// Горизонтальные координаты вкладок, стрелок и линии сняты с макета 1200
const TAB_X = [221, 352, 479, 598, 693, 848]
</script>

<template>
  <div id="projects">
    <!-- Шапка с вкладками — отдельный блок фиксированной высоты, как в макете -->
    <ZeroStage :height="250" bg="#ffffff">
      <h2 class="pj__title">{{ PROJECTS.kicker }}</h2>

      <button type="button" class="pj__arrow pj__arrow--prev" aria-label="Предыдущий проект" @click="goTab(-1)">
        <svg width="17" height="28" viewBox="0 0 17 28" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
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
          :style="`--x: ${TAB_X[i]}px`"
          :aria-selected="p.id === activeId"
          :tabindex="p.id === activeId ? 0 : -1"
          :aria-controls="`panel-${p.id}`"
          @click="activeId = p.id"
          @keydown="onTabKey($event, i)"
        >
          {{ p.tab }}
        </button>
      </div>

      <span class="pj__rule" aria-hidden="true" />

      <button type="button" class="pj__arrow pj__arrow--next" aria-label="Следующий проект" @click="goTab(1)">
        <svg width="17" height="28" viewBox="0 0 17 28" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m2 2 12 12L2 26" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </ZeroStage>

    <!-- Содержимое вкладки: заголовок и описание сверху, под ними галерея.
         Раскладка одинаковая у всех проектов, поэтому при переключении
         ничего не перескакивает. -->
    <section
      :id="`panel-${active.id}`"
      class="pjp"
      role="tabpanel"
      :aria-labelledby="`tab-${active.id}`"
      tabindex="0"
    >
      <div class="pjp__box" :style="boxStyle">
        <Transition name="pjp">
          <div :key="active.id" ref="pane" class="pjp__pane">
            <div class="pjp__inner">
              <h3 class="pjp__name">{{ active.title }}</h3>
              <p v-if="active.subtitle" class="pjp__sub">{{ active.subtitle }}</p>
              <p v-for="(para, i) in active.paragraphs" :key="i" class="pjp__para">{{ para }}</p>

              <ul
                v-if="active.gallery.length"
                class="pjp__gallery"
                :class="{ 'pjp__gallery--dense': active.gallery.length > 4 }"
                role="list"
              >
                <li v-for="(g, i) in active.gallery" :key="g" class="pjp__shot">
                  <SmartImage
                    :name="g"
                    :alt="`${active.title} — фото ${i + 1}`"
                    cover
                    sizes="(min-width: 1201px) 560px, (min-width: 980px) 460px, 100vw"
                  />
                </li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.pj {
  &__title {
    font-size: clamp(1.5rem, 1.2rem + 1.2vw, 32px);
    font-weight: $fw-medium;
    line-height: 50px;
    margin-bottom: $space-md;
    text-align: center;
  }

  &__tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: $space-xs; }

  &__tab {
    padding: 9px 16px;
    font-size: 14px;
    font-weight: $fw-semibold;
    line-height: 21.7px;
    color: $c-brown-700;
    border: 1px solid transparent;
    transition: color $transition, border-color $transition;
    @include focus-ring;

    &:hover { color: $c-green-800; }
    &--active { color: $c-green-800; border-color: $c-tan-500; }
  }

  // Стрелки и линия — часть макета, на узком экране не нужны
  &__arrow, &__rule { display: none; }

  @include up(lg) {
    &__title { @include place((x: 303px, y: 66px, w: 601px, h: 50px)); font-size: 32px; margin: 0; }

    &__tabs { display: contents; }

    &__tab {
      position: absolute;
      top: 140px;
      left: var(--x);
      padding: 16px 6px;
      text-align: center;
    }

    // Две последние вкладки длиннее остальных: в макете они занимают
    // фиксированные 125 px и переносятся на вторую строку
    &__tab:nth-child(n + 5) { width: 125px; padding-block: 4px; }

    &__arrow {
      position: absolute;
      top: 155px;
      display: grid;
      place-items: center;
      width: 17px;
      height: 28px;
      color: $c-brown-700;
      transition: color $transition;
      @include focus-ring;

      &:hover { color: $c-green-800; }
      &--prev { left: 150px; }
      &--next { left: 1033px; }
    }

    &__rule {
      @include place((x: 148px, y: 200px, w: 899px, h: 2px));
      display: block;
      background: $c-tan-500;
    }
  }
}

.pjp {
  background: $c-white;
  padding-bottom: 45px;
  @include focus-ring;

  // Обёртка держит измеренную высоту: при переключении вкладки она
  // доезжает до новой, а не меняется скачком
  &__box {
    position: relative;
    transition: height 0.35s ease;
  }

  &__pane { width: 100%; }

  &__inner { @include t-container; }

  &__name { margin: 0; font-size: 20px; font-weight: $fw-semibold; line-height: 1.35; color: $c-brown-900; }
  &__sub { margin: 12px 0 0; font-size: clamp(1rem, 0.95rem + 0.3vw, 20px); line-height: 1.45; color: $c-brown-900; }
  &__para { margin: 12px 0 0; font-size: clamp(0.9375rem, 0.9rem + 0.2vw, 16px); line-height: 1.55; color: rgba($c-brown-900, 0.85); }

  &__gallery {
    display: grid;
    gap: 20px;
    margin: 30px 0 0;
    padding: 0;
    list-style: none;

    @media (min-width: #{$t-bp-lg}) { grid-template-columns: repeat(2, 1fr); }
    @media (min-width: #{$t-bp-xl}) { gap: 40px; }

    &--dense {
      @media (min-width: #{$t-bp-lg}) { grid-template-columns: repeat(3, 1fr); }
    }
  }

  &__shot {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: $c-sand;

    :deep(picture) { display: block; width: 100%; height: 100%; }
    :deep(img) { width: 100%; height: 100%; object-fit: cover; }
  }
}

// Смена вкладки: уходящая панель растворяется поверх приходящей
.pjp-enter-active, .pjp-leave-active { transition: opacity 0.3s ease; }
.pjp-leave-active { position: absolute; inset: 0; }
.pjp-enter-from, .pjp-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .pjp__box { transition: none; }
  .pjp-enter-active, .pjp-leave-active { transition: none; }
}
</style>
