<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, CalendarDays } from 'lucide-vue-next'
import BridgeStatusIndicator from './BridgeStatusIndicator.vue'
import { useBridgeSocket } from '@/composables/admin/useBridgeSocket'
import { useViewDateStore } from '@/stores/admin/viewDate'
import { fmtDate, fmtTime } from '@/utils/format'

defineEmits(['menu'])
const route = useRoute()
const { status } = useBridgeSocket()
const viewDate = useViewDateStore()
const clock = ref('')
let timer

function tick() {
  clock.value = fmtTime(new Date())
}
onMounted(() => {
  tick()
  timer = setInterval(tick, 60000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white px-4 md:px-6 lg:px-8"
  >
    <button
      type="button"
      class="-ml-1 grid h-10 w-10 place-items-center rounded-md text-ink-700 hover:bg-surface md:hidden"
      aria-label="Buka menu"
      @click="$emit('menu')"
    >
      <Menu :size="22" />
    </button>

    <h1 class="truncate font-display text-[28px] leading-[34px] font-semibold">
      {{ route.meta.title || 'Dashboard' }}
    </h1>

    <div class="ml-auto flex items-center gap-3 sm:gap-4">
      <BridgeStatusIndicator :status="status" />

      <div class="flex items-center gap-2">
        <label
          class="relative flex h-9 items-center gap-2 rounded-md border border-line px-3 text-[13px] text-ink-700 hover:bg-surface"
        >
          <CalendarDays :size="16" class="shrink-0 text-ink-500" />
          <span class="tnum hidden sm:inline">{{ fmtDate(viewDate.date) }}</span>
          <input
            type="date"
            :value="viewDate.date"
            class="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Pilih tanggal yang dilihat"
            @change="viewDate.setDate($event.target.value)"
          />
        </label>
        <button
          v-if="!viewDate.isToday"
          type="button"
          class="text-[12px] font-medium text-red-700 hover:underline"
          @click="viewDate.reset()"
        >
          Hari ini
        </button>
      </div>

      <span class="tnum hidden text-[13px] text-ink-500 lg:inline">{{ clock }}</span>
    </div>
  </header>
</template>
