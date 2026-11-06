<script setup>
defineProps({
  cells: { type: Array, required: true } // { key, label, value, note, to }
})
</script>

<template>
  <div class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-4">
    <RouterLink
      v-for="cell in cells"
      :key="cell.key"
      :to="cell.to"
      class="block bg-white p-4 transition-colors hover:bg-surface"
    >
      <p class="text-sm text-ink-500">{{ cell.label }}</p>
      <p class="mt-1 font-display text-[32px] leading-9 font-semibold text-ink-900">{{ cell.value }}</p>
      <p class="mt-0.5 text-[12px] text-ink-500">{{ cell.note }}</p>
    </RouterLink>
  </div>
</template>
