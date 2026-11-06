<script setup>
import { X } from 'lucide-vue-next'

defineProps({ chips: { type: Array, required: true } })
defineEmits(['remove', 'clear'])
</script>

<template>
  <div v-if="chips.length" class="flex flex-wrap items-center gap-2">
    <span
      v-for="chip in chips"
      :key="chip.key"
      class="inline-flex h-7 items-center gap-1 rounded-sm border border-red-100 bg-red-50 px-2 text-[12px] font-medium text-red-700"
    >
      {{ chip.label }}
      <button
        type="button"
        class="grid h-4 w-4 place-items-center rounded hover:bg-red-100"
        :aria-label="`Hapus filter ${chip.label}`"
        @click="$emit('remove', chip.key)"
      >
        <X :size="12" />
      </button>
    </span>
    <button
      type="button"
      class="text-[12px] font-medium text-ink-500 underline hover:text-ink-900"
      @click="$emit('clear')"
    >
      Hapus filter
    </button>
  </div>
</template>
