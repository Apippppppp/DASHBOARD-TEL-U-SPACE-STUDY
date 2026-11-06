<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: 'idle' } // idle | connected | reconnecting | disconnected
})

const map = {
  connected: { dot: 'bg-free-600', text: 'Server monitoring terhubung', role: 'status' },
  reconnecting: { dot: 'bg-busy-600 animate-pulse-dot', text: 'Menyambung ulang...', role: 'status' },
  disconnected: { dot: 'bg-red-600', text: 'Server monitoring terputus', role: 'alert' },
  idle: { dot: 'bg-ink-400', text: 'Menghubungkan...', role: 'status' }
}

const view = computed(() => map[props.status] ?? map.idle)
</script>

<template>
  <div :role="view.role" class="flex items-center gap-2 text-[13px] text-ink-500">
    <span class="h-2 w-2 shrink-0 rounded-full" :class="view.dot" />
    <span class="hidden sm:inline">{{ view.text }}</span>
    <span class="sr-only sm:hidden">{{ view.text }}</span>
  </div>
</template>
