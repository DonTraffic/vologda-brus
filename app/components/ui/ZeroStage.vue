<script setup lang="ts">
/**
 * Масштабируемая сцена секции.
 *
 * Тильда рисует блоки на холсте 1200px фиксированной высоты и целиком
 * масштабирует его под ширину окна свойством zoom — поэтому вместе с
 * раскладкой растёт и шрифт. Здесь то же самое: коробка 1200×height
 * с координатами из макета, увеличенная тем же коэффициентом.
 *
 * Ниже 1024px сцена отключается, и содержимое идёт обычным потоком —
 * это и даёт «нормальную структуру» вместо четырёх наборов координат.
 */
withDefaults(defineProps<{
  /** Высота холста в координатах макета. */
  height: number
  /** Цвет фона секции. */
  bg?: string
  tag?: string
  /**
   * Масштабировать холст под ширину окна.
   *
   * В оригинале так ведёт себя не всякий блок: часть холстов сохраняет
   * фиксированную высоту, а обычные блоки вообще текучие. Поэтому режим
   * включается точечно, а не по умолчанию.
   */
  scale?: boolean
}>(), {
  bg: 'transparent',
  tag: 'section',
  scale: false,
})
</script>

<template>
  <component
    :is="tag"
    class="stage-wrap"
    :class="{ 'stage-wrap--scale': scale }"
    :style="{ '--h': `${height}px`, '--bg': bg }"
  >
    <div class="stage">
      <slot />
    </div>
  </component>
</template>

<style scoped lang="scss">
.stage-wrap {
  background: var(--bg);
}

.stage {
  width: min(#{$stage-w}, 100%);
  margin-inline: auto;
  padding: clamp(40px, 7vw, 72px) $gutter;
}

@include up(lg) {
  // Холст фиксированной высоты: координаты макета, без растяжения
  .stage-wrap {
    height: var(--h);
    overflow: hidden;
  }

  .stage {
    position: relative;
    width: $stage-w;
    height: var(--h);
    padding: 0;
  }

  // Между 1024 и 1200 холст шире окна. Если оставить его как есть,
  // содержимое уезжает влево и обрезается справа — поэтому ужимаем
  // холст целиком, сохраняя координаты макета.
  @media (max-width: #{$stage-w}) {
    .stage-wrap {
      --k: tan(atan2(100vw, #{$stage-w}));
      height: calc(var(--h) * var(--k));
    }

    .stage {
      transform: scale(var(--k));
      transform-origin: top center;
    }
  }

  // Холст, который тянется за шириной окна вместе со шрифтом
  .stage-wrap--scale {
    --k: tan(atan2(100vw, #{$stage-w}));
    height: calc(var(--h) * var(--k));

    .stage {
      transform: scale(var(--k));
      transform-origin: top center;
    }
  }
}
</style>
