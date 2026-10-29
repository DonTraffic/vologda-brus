<script setup lang="ts">

withDefaults(defineProps<{ name: 'chat' | 'phone' | 'mail' | 'pin' | 'arrow-up' | 'burger' | 'close'; size?: number }>(), {
  size: 20,
})
</script>

<template>
  <svg
    :width="size" :height="size" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true" focusable="false"
  >
    <template v-if="name === 'chat'">
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 0 1 11 4h2a8 8 0 0 1 8 8Z" />
    </template>
    <template v-else-if="name === 'phone'">
      <path d="M6 3h3l2 5-2.2 1.6a12 12 0 0 0 5.6 5.6L16 13l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2A2 2 0 0 1 6 3Z" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </template>
    <template v-else-if="name === 'pin'">
      <path d="M12 21s-7-5.3-7-11a7 7 0 1 1 14 0c0 5.7-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </template>
    <template v-else-if="name === 'arrow-up'">
      <path d="M12 19V5m0 0-6 6m6-6 6 6" />
    </template>
    <template v-else-if="name === 'burger'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </template>
  </svg>
</template>
