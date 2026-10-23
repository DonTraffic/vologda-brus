<script setup lang="ts">
import { ADDRESS, PHONE_DISPLAY, PHONE_HREF, EMAIL, LEGAL, WORK_HOURS, COMPANY } from '~/data/site'

/**
 * Полоса с реквизитами и картой производства.
 *
 * Карта тяжёлая, поэтому библиотека подгружается только когда блок
 * доезжает до экрана. Если скрипт не загрузился, на месте карты остаётся
 * тёмная подложка, а адрес и телефон рядом — текстом.
 */
const host = ref<HTMLElement | null>(null)
const canvas = ref<HTMLElement | null>(null)
const failed = ref(false)

onMounted(() => {
  if (!host.value || ADDRESS.lat == null || ADDRESS.lon == null) return

  const start = async () => {
    try {
      const [maplibre] = await Promise.all([
        import('maplibre-gl'),
        import('maplibre-gl/dist/maplibre-gl.css'),
      ])
      const { Map, Marker, setWorkerUrl } = maplibre
      // Воркер лежит отдельным файлом — его кладёт scripts/copy-maplibre.mjs
      setWorkerUrl('/vendor/maplibre-gl-worker.mjs')
      if (!canvas.value) return
      const map = new Map({
        container: canvas.value,
        style: 'https://tiles.openfreemap.org/styles/dark',
        center: [ADDRESS.lon!, ADDRESS.lat!],
        zoom: 13.6,
        attributionControl: false,
        cooperativeGestures: true,
      })
      const pin = document.createElement('span')
      pin.className = 'cm__pin'
      new Marker({ element: pin, anchor: 'bottom' })
        .setLngLat([ADDRESS.lon!, ADDRESS.lat!])
        .addTo(map)

      // Слева лежит колонка с реквизитами — отводим метку из-под неё
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

        <p class="cm__legal">
          {{ LEGAL.name }}<br>
          ИНН {{ LEGAL.inn }}<br>
          ОГРНИП {{ LEGAL.ogrnip }}
        </p>

        <dl class="cm__list">
          <dt>Юридический адрес</dt>
          <dd>{{ LEGAL.addressLegal }}</dd>

          <dt>Производство</dt>
          <dd>{{ ADDRESS.postalCode }}, {{ ADDRESS.full }}</dd>

          <dt>График работы</dt>
          <dd>{{ WORK_HOURS.text }}</dd>

          <dt>Телефон</dt>
          <dd><a :href="`tel:${PHONE_HREF}`">{{ PHONE_DISPLAY }}</a></dd>

          <dt>Почта</dt>
          <dd><a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a></dd>
        </dl>

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

  // Затемнение, чтобы текст читался поверх карты
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

  &__legal {
    margin: 0 0 $space-lg;
    font-size: 15px;
    line-height: 23px;
    color: rgba($c-white, 0.78);
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

  &__credit {
    position: absolute;
    right: 16px;
    bottom: 12px;
    z-index: 2;
    margin: 0;
    font-size: 12px;
    color: rgba($c-white, 0.6);

    a { color: inherit; text-decoration: underline; }
  }

  @include up(md) {
    &__card { padding-block: $space-md; }
  }
}

// Метка производства: капля с белой точкой внутри
:global(.cm__pin) {
  display: block;
  width: 28px;
  height: 28px;
  background: $c-tan-500;
  border-radius: 50% 50% 50% 0;
  box-shadow: 0 0 0 6px rgba($c-tan-500, 0.25);
  transform: rotate(-45deg) translate(6px, -6px);
}

:global(.cm__pin)::after {
  content: '';
  position: absolute;
  inset: 9px;
  background: $c-green-900;
  border-radius: 50%;
}
</style>
