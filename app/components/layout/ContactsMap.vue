<script setup lang="ts">
import { ADDRESS, PHONE_DISPLAY, PHONE_HREF, EMAIL, WORK_HOURS, COMPANY } from '~/data/site'

const host = ref<HTMLElement | null>(null)
const canvas = ref<HTMLElement | null>(null)
const failed = ref(false)

const routeHref = computed(() => {
  if (ADDRESS.lat == null || ADDRESS.lon == null) return ''
  return `https://yandex.ru/maps/?rtext=~${ADDRESS.lat},${ADDRESS.lon}&rtt=auto`
})

onMounted(() => {
  if (!host.value || ADDRESS.lat == null || ADDRESS.lon == null) return

  const start = async () => {
    try {
      const [maplibre] = await Promise.all([
        import('maplibre-gl'),
        import('maplibre-gl/dist/maplibre-gl.css'),
      ])
      const { Map, Marker, setWorkerUrl } = maplibre

      setWorkerUrl('/vendor/maplibre-gl-worker.mjs')
      if (!canvas.value) return
      const map = new Map({
        container: canvas.value,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [ADDRESS.lon!, ADDRESS.lat!],
        zoom: 15.2,
        attributionControl: false,
        cooperativeGestures: true,
      })
      const pin = document.createElement('span')
      pin.className = 'cm__pin'
      pin.setAttribute('aria-hidden', 'true')
      const mark = document.createElement('img')
      mark.src = '/images/header.svg'
      mark.alt = ''
      mark.width = 1032
      mark.height = 582
      pin.appendChild(mark)
      new Marker({ element: pin, anchor: 'bottom', offset: [0, -8] })
        .setLngLat([ADDRESS.lon!, ADDRESS.lat!])
        .addTo(map)

      map.on('load', () => {
        if (window.innerWidth >= 980) map.panBy([-300, 0], { duration: 0 })
      })
    } catch {
      failed.value = true
    }
  }

  if (!('IntersectionObserver' in window)) { start(); return }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some(e => e.isIntersecting)) return
    io.disconnect()
    start()
  }, { rootMargin: '300px' })
  io.observe(host.value)
})
</script>

<template>
  <section ref="host" class="cm" aria-labelledby="cm-title">
    <div ref="canvas" class="cm__map" role="presentation" />
    <div class="cm__veil" aria-hidden="true" />

    <div class="cm__inner">
      <div class="cm__card">
        <h2 id="cm-title" class="cm__title">Контакты {{ COMPANY.name }}</h2>

        <dl class="cm__list">
          <dt>Отдел продаж</dt>
          <dd>{{ ADDRESS.sales }}</dd>

          <dt>Производство</dt>
          <dd>{{ ADDRESS.postalCode }}, {{ ADDRESS.full }}</dd>

          <dt>График работы</dt>
          <dd>{{ WORK_HOURS.text }}</dd>

          <dt>Телефон</dt>
          <dd><a :href="`tel:${PHONE_HREF}`">{{ PHONE_DISPLAY }}</a></dd>

          <dt>Почта</dt>
          <dd><a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a></dd>
        </dl>

        <a
          v-if="routeHref" class="cm__route" :href="routeHref"
          target="_blank" rel="noopener noreferrer"
        >
          Проложить маршрут
        </a>

        <p v-if="failed" class="cm__fallback">
          Карта не загрузилась — адрес выше можно скопировать в навигатор.
        </p>
      </div>
    </div>

    <p class="cm__credit">
      Карта: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
      · <a href="https://openfreemap.org/" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>
    </p>
  </section>
</template>

<style scoped lang="scss">
.cm {
  position: relative;
  min-height: 560px;
  padding-block: clamp(40px, 5vw, 70px) 44px;
  background: $c-green-900;
  border-top: 3px solid $c-tan-500;
  isolation: isolate;

  &__map {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__veil {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      to right,
      rgba($c-green-900, 0.92) 0%,
      rgba($c-green-900, 0.86) 26%,
      rgba($c-green-900, 0.3) 46%,
      rgba($c-green-900, 0) 62%
    );
  }

  &__inner {
    @include t-container;
    position: relative;
    z-index: 2;
    pointer-events: none;
  }

  &__card { max-width: 520px; pointer-events: auto; }

  &__title {
    margin: 0 0 $space-md;
    font-size: clamp(1.375rem, 1.1rem + 1.2vw, 32px);
    font-weight: $fw-semibold;
    line-height: 1.2;
    color: $c-tan-500;
  }

  &__list {
    display: grid;
    gap: 4px 0;
    margin: 0;

    dt {
      font-size: 13px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: $c-tan-500;
    }

    dd {
      margin: 0 0 $space-md;
      font-size: 17px;
      line-height: 25px;
      color: $c-white;
    }

    a {
      color: $c-mint-300;
      text-decoration: underline;
      text-underline-offset: 3px;
      @include focus-ring($c-mint-300);

      &:hover { color: $c-white; }
    }
  }

  &__fallback { margin: 0; font-size: 14px; color: rgba($c-white, 0.7); }

  &__route {
    display: inline-block;
    margin-top: 18px;
    padding: 12px 22px;
    font-size: 15px;
    font-weight: $fw-medium;
    color: $c-green-900;
    background: $c-tan-500;
    transition: background-color $transition;
    @include focus-ring;

    &:hover { background: $c-tan-400; }
  }

  &__credit {
    position: absolute;
    right: 16px;
    bottom: 12px;
    z-index: 2;
    margin: 0;
    padding: 2px 8px;
    font-size: 12px;
    color: rgba($c-brown-900, 0.75);
    background: rgba($c-white, 0.7);
    border-radius: 2px;

    a { color: inherit; text-decoration: underline; }
  }

  @include up(md) {
    &__card { padding-block: $space-md; }
  }

  @media (max-width: #{$t-bp-lg - 1}) {
    display: flex;
    flex-direction: column;
    padding-bottom: 0;

    &__inner { order: 1; }
    &__veil { display: none; }

    &__map {
      position: relative;
      order: 2;
      height: 320px;
      margin-top: 28px;
    }
  }
}

:global(.cm__pin) {
  position: relative;
  display: block;
  width: 104px;
  padding: 9px 10px;
  background: $c-green-800;
  border: 2px solid $c-tan-500;
  border-radius: 3px;
  box-shadow: 0 6px 18px rgba($c-green-900, 0.45);
}

:global(.cm__pin img) {
  display: block;
  width: 100%;
  height: auto;
}

:global(.cm__pin::after) {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 13px;
  height: 13px;
  background: $c-green-800;
  border-right: 2px solid $c-tan-500;
  border-bottom: 2px solid $c-tan-500;
  transform: translateX(-50%) rotate(45deg);
}

:global(.maplibregl-ctrl-logo) { display: none; }
</style>
