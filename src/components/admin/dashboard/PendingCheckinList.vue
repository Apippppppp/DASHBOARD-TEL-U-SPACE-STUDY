<script setup>
import StatusBadge from '@/components/admin/shared/StatusBadge.vue'
import { fmtTime, minutesLate } from '@/utils/format'

defineProps({
  items: { type: Array, required: true } // { reservation, late }
})
const emit = defineEmits(['open'])
</script>

<template>
  <div>
    <p class="mb-2 text-[12px] font-medium text-ink-500">Menunggu check-in</p>
    <ul v-if="items.length" class="divide-y divide-line rounded-lg border border-line">
      <li v-for="item in items" :key="item.reservation.code">
        <button
          type="button"
          class="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-surface"
          @click="emit('open', item.reservation)"
        >
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-ink-900">{{ item.reservation.student?.name }}</p>
            <p class="text-[12px] text-ink-500">
              {{ item.reservation.room?.name }} · {{ fmtTime(item.reservation.start) }}
            </p>
          </div>
          <StatusBadge
            v-if="item.late"
            variant="warning"
            :label="`Terlambat ${minutesLate(item.reservation.start)} mnt`"
          />
        </button>
      </li>
    </ul>
    <p v-else class="rounded-lg border border-line px-3 py-4 text-sm text-ink-500">
      Tidak ada reservasi yang menunggu check-in.
    </p>
  </div>
</template>
