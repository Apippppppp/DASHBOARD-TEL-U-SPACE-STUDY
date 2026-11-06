<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  actionLabel: { type: String, default: '' }
})
defineEmits(['action'])
</script>

<template>
  <div class="grid place-items-center rounded-lg border border-line bg-white px-6 py-14 text-center">
    <p class="font-display text-lg font-semibold text-ink-900">{{ title }}</p>
    <p v-if="text" class="mt-1 max-w-md text-sm text-ink-500">{{ text }}</p>
    <button
      v-if="actionLabel"
      type="button"
      class="mt-5 h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
    <slot />
  </div>
</template>
