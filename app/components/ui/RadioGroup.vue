<script setup lang="ts">
/** Группа переключателей в fieldset — так её правильно читает скринридер. */
const props = defineProps<{
  legend: string
  name: string
  options: readonly string[]
  modelValue: string
  hint?: string
  required?: boolean
}>()

defineEmits<{ 'update:modelValue': [string] }>()

const uid = useId()
</script>

<template>
  <fieldset class="rg">
    <legend class="rg__legend">
      {{ legend }}<span v-if="required" aria-hidden="true"> *</span>
    </legend>
    <p v-if="hint" class="rg__hint">{{ hint }}</p>

    <div class="rg__options">
      <label v-for="opt in options" :key="opt" class="rg__option">
        <input
          type="radio"
          class="rg__input"
          :name="`${name}-${uid}`"
          :value="opt"
          :checked="modelValue === opt"
          :required="required"
          @change="$emit('update:modelValue', opt)"
        >
        <span class="rg__text">{{ opt }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.rg {
  margin: 0;
  padding: 0;
  border: 0;

  &__legend { padding: 0; margin-bottom: 6px; font-size: $fs-small; font-weight: $fw-semibold; }

  &__hint { margin-bottom: $space-xs; font-size: $fs-xs; color: $c-text-muted; line-height: 1.45; }

  &__options { display: flex; flex-wrap: wrap; gap: $space-xs; }

  &__option { position: relative; cursor: pointer; }

  &__input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;

    &:focus-visible + .rg__text { outline: 2px solid $c-green-800; outline-offset: 2px; }
    &:checked + .rg__text { color: $c-white; background: $c-green-800; border-color: $c-green-800; }
  }

  &__text {
    display: block;
    padding: 10px 18px;
    font-size: $fs-small;
    background: $c-white;
    border: 1px solid $c-border;
    border-radius: $radius-pill;
    transition: background-color $transition, color $transition, border-color $transition;
  }
}
</style>
