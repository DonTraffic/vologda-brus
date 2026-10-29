<script setup lang="ts">

withDefaults(defineProps<{

  height: number

  bg?: string
  tag?: string

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
