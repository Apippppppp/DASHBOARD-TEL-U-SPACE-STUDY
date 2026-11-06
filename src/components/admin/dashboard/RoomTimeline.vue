<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: { type: Array, required: true }, // { room, reservations: [] }
  now: { type: Date, default: null } // null = jangan tampilkan penanda "sekarang"
})
const emit = defineEmits(['open'])

const START = 7
const END = 21
const SPAN = (END - START) * 60
const hours = Array.from({ length: END - START + 1 }, (_, i) => START + i)

const nowPct = computed(() => {
  if (!props.now) return null
  const d = props.now
  const minutes = (d.getHours() - START) * 60 + d.getMinutes()
  return Math.max(0, Math.min(100, (minutes / SPAN) * 100))
})

const toMinutes = (iso) => {
  const d = new Date(iso)
  return d.getHours() * 60 + d.getMinutes()
}

function block(r) {
  const start = Math.max(toMinutes(r.start), START * 60)
  const end = Math.min(toMinutes(r.end), END * 60)
  const left = ((start - START * 60) / SPAN) * 100
  const width = ((end - start) / SPAN) * 100
  return { left: `${left}%`, width: `${Math.max(width, 1)}%` }
}

const blockClass = {
  waiting: 'bg-red-100 border border-red-600 text-red-700',
  active: 'bg-red-600 text-white',
  done: 'bg-surface text-ink-500'
}
</script>

<template>
  <div class="overflow-x-auto">
    <div class="min-w-[640px]">
      <div class="flex">
        <div class="w-24 shrink-0">
          <div class="mb-1 h-4" />
          <div v-for="row in rows" :key="row.room.id" class="flex h-9 items-center">
            <span class="truncate pr-2 text-[12px] text-ink-700">{{ row.room.name }}</span>
          </div>
        </div>

        <div class="relative flex-1">
          <div class="relative mb-1 h-4">
            <span
              v-for="h in hours"
              :key="h"
              class="tnum absolute -translate-x-1/2 text-[11px] text-ink-400"
              :style="{ left: `${((h - START) / (END - START)) * 100}%` }"
            >
              {{ String(h).padStart(2, '0') }}
            </span>
          </div>

          <div v-for="row in rows" :key="row.room.id" class="relative my-1 h-7 rounded-sm bg-surface">
            <button
              v-for="r in row.reservations"
              :key="r.code"
              type="button"
              class="absolute top-0 h-full overflow-hidden rounded-sm px-1 text-left text-[11px] leading-7 whitespace-nowrap"
              :class="blockClass[r.status]"
              :style="block(r)"
              :title="`${r.code} · ${r.student?.name ?? ''}`"
              @click="emit('open', r)"
            >
              <span class="truncate">{{ r.student?.name }}</span>
            </button>
          </div>

          <div
            v-if="nowPct !== null"
            class="pointer-events-none absolute inset-y-0 z-10"
            :style="{ left: `${nowPct}%` }"
          >
            <div class="h-full bg-ink-900" style="width: 1.5px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
