<script setup lang="ts">

const props = withDefaults(defineProps<{
  before: { src: string; alt: string }
  after: { src: string; alt: string }
  labelBefore?: string
  labelAfter?: string
}>(), {
  labelBefore: 'До',
  labelAfter: 'После',
})

const position = ref(50)
const clip = computed(() => `inset(0 0 0 ${position.value}%)`)
</script>

<template>
  <figure class="ba">
    <div class="ba__frame">
      <SmartImage :name="props.before.src" :alt="props.before.alt" cover sizes="(min-width: 1024px) 50vw, 100vw" />
      <div class="ba__after" :style="{ clipPath: clip }">
        <SmartImage :name="props.after.src" :alt="props.after.alt" cover sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>

      <div class="ba__handle" :style="{ left: `${position}%` }" aria-hidden="true">
        <span class="ba__handle-grip" />
      </div>

      <span class="ba__tag ba__tag--before">{{ labelBefore }}</span>
      <span class="ba__tag ba__tag--after">{{ labelAfter }}</span>

      <input
        v-model.number="position"
        class="ba__range"
        type="range"
        min="0"
        max="100"
        step="0.5"
        :aria-label="`Сравнение: ${labelBefore} и ${labelAfter}`"
      >
    </div>
  </figure>
</template>

<style scoped lang="scss">
.ba {
  margin: 0;

  &__frame {
    position: relative;
    overflow: hidden;
    border-radius: $radius-md;
    aspect-ratio: 4 / 3;
    background: $c-sand;

    > :deep(picture),
    > :deep(img) { position: absolute; inset: 0; width: 100%; height: 100%; }
    > :deep(picture) img { width: 100%; height: 100%; object-fit: cover; }
  }

  &__after {
    position: absolute;
    inset: 0;

    :deep(picture), :deep(img) { position: absolute; inset: 0; width: 100%; height: 100%; }
    :deep(picture) img { object-fit: cover; }
  }

  &__handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: $c-white;
    transform: translateX(-1px);
    pointer-events: none;
    box-shadow: 0 0 0 1px rgba($c-black, 0.15);
  }

  &__handle-grip {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 24px;
    border-radius: 3px;
    background: $c-white;
    transform: translate(-50%, -50%);
    box-shadow: $shadow-md;

    &::after {
      content: '‹›';
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      font-size: 13px;
      line-height: 1;
      color: $c-brown-900;
    }
  }

  &__tag {
    position: absolute;
    top: 10px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: $fw-semibold;
    letter-spacing: 0.04em;
    color: $c-white;
    background: rgba($c-brown-900, 0.72);
    border-radius: 2px;
    pointer-events: none;

    &--before { left: 10px; }
    &--after { right: 10px; }
  }

  &__range {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: ew-resize;
    appearance: none;

    &:focus-visible {
      opacity: 1;
      outline: 2px solid $c-green-800;
      outline-offset: 2px;
    }
  }
}
</style>
