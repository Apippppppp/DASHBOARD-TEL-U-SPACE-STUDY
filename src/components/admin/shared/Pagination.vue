<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  page: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  perPage: { type: Number, default: 10 }
})
const emit = defineEmits(['update:page'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))

const pages = computed(() => {
  const t = totalPages.value
  const cur = props.page
  const start = Math.max(1, Math.min(cur - 2, t - 4))
  return Array.from({ length: Math.min(5, t) }, (_, i) => start + i)
})

const go = (p) => {
  if (p >= 1 && p <= totalPages.value && p !== props.page) emit('update:page', p)
}
</script>

<template>
  <nav v-if="total > perPage" class="flex items-center justify-end gap-1 py-3" aria-label="Pagination">
    <button
      type="button"
      class="grid h-9 w-9 place-items-center rounded-md text-ink-500 hover:bg-surface disabled:opacity-40"
      :disabled="page <= 1"
      aria-label="Halaman sebelumnya"
      @click="go(page - 1)"
    >
      <ChevronLeft :size="18" />
    </button>
    <button
      v-for="p in pages"
      :key="p"
      type="button"
      class="tnum h-9 min-w-9 rounded-md px-2 text-sm"
      :class="p === page ? 'bg-red-600 text-white' : 'text-ink-700 hover:bg-surface'"
      :aria-current="p === page ? 'page' : undefined"
      @click="go(p)"
    >
      {{ p }}
    </button>
    <button
      type="button"
      class="grid h-9 w-9 place-items-center rounded-md text-ink-500 hover:bg-surface disabled:opacity-40"
      :disabled="page >= totalPages"
      aria-label="Halaman berikutnya"
      @click="go(page + 1)"
    >
      <ChevronRight :size="18" />
    </button>
  </nav>
</template>
