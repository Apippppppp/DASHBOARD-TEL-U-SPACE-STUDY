<script setup>
import { CheckCircle2, XCircle } from 'lucide-vue-next'

defineProps({ items: { type: Array, default: () => [] } })
</script>

<template>
  <div>
    <p class="mb-2 text-[12px] font-medium text-ink-500">Pindaian terakhir</p>
    <ul v-if="items.length" class="divide-y divide-line rounded-lg border border-line">
      <li v-for="(item, i) in items" :key="i" class="flex items-center gap-3 px-3 py-2">
        <span class="tnum w-10 shrink-0 text-[13px] text-ink-500">{{ item.at }}</span>
        <span class="min-w-0 flex-1 truncate text-sm text-ink-900">{{ item.name }}</span>
        <span class="hidden shrink-0 text-[12px] text-ink-500 sm:inline">{{ item.room }}</span>
        <CheckCircle2 v-if="item.ok" :size="18" class="shrink-0 text-free-600" />
        <XCircle v-else :size="18" class="shrink-0 text-red-600" />
      </li>
    </ul>
    <p v-else class="rounded-lg border border-line px-3 py-4 text-sm text-ink-500">
      Belum ada pindaian.
    </p>
  </div>
</template>
