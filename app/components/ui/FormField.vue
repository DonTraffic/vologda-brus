<script setup lang="ts">

const props = withDefaults(defineProps<{
  label: string
  type?: 'text' | 'tel' | 'email' | 'textarea'
  modelValue: string
  name: string
  required?: boolean
  placeholder?: string
  autocomplete?: string
  hint?: string
  rows?: number
  error?: string
}>(), {
  type: 'text',
  required: false,
  rows: 4,
})

defineEmits<{ 'update:modelValue': [string] }>()

const uid = useId()
const fieldId = computed(() => `f-${props.name}-${uid}`)
const hintId = computed(() => (props.hint ? `${fieldId.value}-hint` : undefined))
const errorId = computed(() => (props.error ? `${fieldId.value}-error` : undefined))
const describedBy = computed(() => [hintId.value, errorId.value].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div class="field" :class="{ 'field--invalid': !!error }">
    <label class="field__label" :for="fieldId">
      {{ label }}<span v-if="required" class="field__req" aria-hidden="true"> *</span>
    </label>

    <p v-if="hint" :id="hintId" class="field__hint">{{ hint }}</p>

    <textarea
      v-if="type === 'textarea'"
      :id="fieldId"
      class="field__control"
      :name="name"
      :rows="rows"
      :required="required"
      :placeholder="placeholder"
      :aria-describedby="describedBy"
      :aria-invalid="!!error || undefined"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      :id="fieldId"
      class="field__control"
      :type="type"
      :name="name"
      :required="required"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-describedby="describedBy"
      :aria-invalid="!!error || undefined"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >

    <p v-if="error" :id="errorId" class="field__error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label { font-size: $fs-small; font-weight: $fw-semibold; }

  &__req { color: $c-accent-hover; }

  &__hint { font-size: $fs-xs; color: $c-text-muted; line-height: 1.45; }

  &__control {
    width: 100%;
    padding: 13px 15px;
    font-size: $fs-body;
    background: $c-white;
    border: 1px solid $c-border;
    border-radius: $radius-sm;
    transition: border-color $transition, box-shadow $transition;

    &::placeholder { color: rgba($c-brown-900, 0.4); }

    &:focus {
      outline: none;
      border-color: $c-green-800;
      box-shadow: 0 0 0 3px rgba($c-green-800, 0.14);
    }
  }

  textarea.field__control { resize: vertical; min-height: 96px; }

  &--invalid &__control { border-color: #b4342a; }

  &__error { font-size: $fs-xs; color: #b4342a; }
}
</style>
