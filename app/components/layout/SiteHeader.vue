<script setup lang="ts">
import { PHONE_DISPLAY, PHONE_HREF, COMPANY, MESSENGERS } from '~/data/site'

const { open: openMessengers } = useMessengerModal()

const isMenuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { isMenuOpen.value = false })
watch(isMenuOpen, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
onBeforeUnmount(() => { if (import.meta.client) document.body.style.overflow = '' })

// В шапке — только Telegram и MAX, как в оригинале; WhatsApp живёт
// во всплывающем окне и в подвале.
const headerMessengers = computed(() => MESSENGERS.filter(m => m.id !== 'whatsapp'))
</script>

<template>
  <header class="hdr">
    <div class="hdr__inner">
      <NuxtLink to="/" class="hdr__brand" :aria-label="COMPANY.name">
        <img src="/images/header.svg" alt="" class="hdr__logo" width="1032" height="582">
        <span class="hdr__slogan">
          Производство клееного бруса<br>
          полного цикла и строительство домов<br>
          под контролем производителя
        </span>
      </NuxtLink>

      <div class="hdr__right">
        <a :href="`tel:${PHONE_HREF}`" class="hdr__phone">{{ PHONE_DISPLAY }}</a>

        <ul class="hdr__msgs" role="list">
          <li v-for="m in headerMessengers" :key="m.id">
            <a :href="m.href" class="hdr__msg" target="_blank" rel="noopener noreferrer" :aria-label="m.label">
              <IconMessenger :name="m.icon === 'max' ? 'max' : 'telegram'" :size="30" />
            </a>
          </li>
        </ul>

        <!-- Ведёт к блоку экскурсии и форме записи: на текущем сайте
             эта кнопка набирала телефон -->
        <NuxtLink to="/#excursion" class="hdr__cta">
          Посетить производство
        </NuxtLink>

        <button
          type="button" class="hdr__burger"
          :aria-expanded="isMenuOpen" aria-controls="hdr-menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <IconChat :name="isMenuOpen ? 'close' : 'burger'" :size="22" />
          <span class="visually-hidden">{{ isMenuOpen ? 'Закрыть меню' : 'Меню' }}</span>
        </button>
      </div>
    </div>

    <Transition name="drop">
      <nav v-if="isMenuOpen" id="hdr-menu" class="hdr__mobile" aria-label="Меню">
        <a :href="`tel:${PHONE_HREF}`" class="hdr__mobile-phone">{{ PHONE_DISPLAY }}</a>
        <a
          v-for="m in headerMessengers" :key="m.id" :href="m.href"
          class="hdr__mobile-link" target="_blank" rel="noopener noreferrer"
        >{{ m.label }}</a>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
// Шапка лежит поверх фотографии первого экрана, как в оригинале,
// поэтому она не sticky и не имеет собственной высоты в потоке.
.hdr {
  --hdr-h: 56px;
  @include up(lg) { --hdr-h: 70px; }
  // Поверх первого экрана, не занимая места в потоке: так фотография
  // начинается от самого верха окна, как в макете.
  position: absolute;
  inset: 0 0 auto;
  z-index: 50;
  background: $c-green-800;

  &__inner {
    width: min(#{$stage-w}, 100%);
    margin-inline: auto;
    display: flex;
    align-items: center;
    gap: $space-md;
    min-height: 56px;
    padding-inline: $gutter;

    // Шапка оригинала: полоса 70 px, поля 20 px, логотип 90×51,
    // значки мессенджеров 30 px, кнопка 228×40.
    @include up(lg) { min-height: 70px; padding-inline: 20px; }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-right: auto;
    @include focus-ring($c-mint-300);

    @include up(lg) { gap: 10px; }
  }

  &__logo {
    width: auto;
    height: 30px;

    @include up(lg) { width: 90px; height: auto; }
  }

  // Слоган набран очень мелко — ровно как в макете, 10px
  &__slogan {
    display: none;
    font-size: 10px;
    font-weight: $fw-regular;
    line-height: 14px;
    color: $c-tan-500;

    @include up(md) { display: block; }
  }

  &__right { display: flex; align-items: center; gap: 14px; }

  @include up(lg) {
    &__right { gap: 30px; }
  }

  &__phone {
    display: none;
    font-size: 14px;
    font-weight: $fw-semibold;
    color: $c-mint-100;
    white-space: nowrap;
    @include focus-ring($c-mint-300);

    &:hover { color: $c-mint-300; }
    @include up(md) { display: block; }
    @include up(lg) { font-size: 16px; }
  }

  &__msgs { display: none; gap: 8px; list-style: none; margin: 0; padding: 0; @include up(md) { display: flex; } @include up(lg) { gap: 12px; } }

  // Значок сам по себе — залитый круг, подложка ему не нужна
  &__msg {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    color: $c-mint-100;
    border-radius: 50%;
    transition: color $transition;
    @include focus-ring($c-mint-300);

    &:hover { color: $c-mint-300; }
  }

  &__cta {
    display: none;
    padding: 8px 30px;
    font-size: 14px;
    font-weight: $fw-semibold;
    white-space: nowrap;
    color: $c-green-800;
    background: $c-mint-100;
    border: 1px solid $c-mint-100;
    border-radius: 1px;
    transition: color $transition, background-color $transition, border-color $transition;
    @include focus-ring($c-mint-300);

    &:hover { color: $c-mint-300; background: $c-green-800; border-color: $c-mint-300; }
    @include up(lg) { display: block; }
  }

  &__burger {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    color: $c-mint-100;
    @include focus-ring($c-mint-300);
    @include up(lg) { display: none; }
  }

  &__mobile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: $space-sm $gutter $space-md;
    border-top: 1px solid rgba($c-white, 0.16);
    @include up(lg) { display: none; }
  }

  &__mobile-phone { font-size: $fs-h4; font-weight: $fw-bold; color: $c-mint-100; padding-block: 8px; }

  &__mobile-link { padding-block: 10px; font-size: $fs-body; color: $c-tan-500; }
}

.drop-enter-active, .drop-leave-active { transition: opacity $transition, transform $transition; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
