<script setup>
import { computed } from 'vue'

const props = defineProps({
  device: { type: Boolean, default: true },
  bridgeConnected: { type: Boolean, default: true },
  freshness: { type: String, default: 'none' } // none | ok | stale | offline
})

const view = computed(() => {
  if (!props.device) return { dot: 'bg-ink-400', text: 'text-ink-700', label: 'Perangkat belum terpasang' }
  if (!props.bridgeConnected) return { dot: 'bg-ink-400', text: 'text-ink-700', label: 'Status tidak diketahui' }
  if (props.freshness === 'ok') return { dot: 'bg-free-600', text: 'text-free-600', label: 'Online' }
  if (props.freshness === 'stale') return { dot: 'bg-busy-600', text: 'text-busy-600', label: 'Tertunda' }
  return { dot: 'bg-ink-400', text: 'text-ink-700', label: 'Offline' }
})
</script>

<template>
  <span class="inline-flex items-center gap-2 text-[13px] font-medium" :class="view.text">
    <span class="h-2 w-2 rounded-full" :class="view.dot" />
    {{ view.label }}
  </span>
</template>
