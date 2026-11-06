<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, required: true },
  label: { type: String, default: '' }
})

const MAP = {
  waiting: { dot: 'bg-busy-600', text: 'text-busy-600', bg: 'bg-busy-50', label: 'Menunggu' },
  active: { dot: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50', label: 'Aktif' },
  done: { dot: 'bg-ink-500', text: 'text-ink-700', bg: 'bg-surface', label: 'Selesai' },
  cancelled: { dot: 'bg-red-600', text: 'text-red-600', bg: 'bg-red-50', label: 'Dibatalkan' },
  ok: { dot: 'bg-free-600', text: 'text-free-600', bg: 'bg-free-50', label: 'Berhasil' },
  denied: { dot: 'bg-red-600', text: 'text-red-600', bg: 'bg-red-50', label: 'Ditolak' },
  warning: { dot: 'bg-busy-600', text: 'text-busy-600', bg: 'bg-busy-50', label: 'Perhatian' },
  offline: { dot: 'bg-ink-400', text: 'text-ink-700', bg: 'bg-surface', label: 'Offline' }
}

const view = computed(() => MAP[props.variant] ?? MAP.offline)
</script>

<template>
  <span
    class="inline-flex h-6 items-center gap-1.5 rounded-sm px-2 text-[12px] font-medium"
    :class="[view.bg, view.text]"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="view.dot" />
    {{ label || view.label }}
  </span>
</template>
