<script setup>
import DataTable from '@/components/admin/shared/DataTable.vue'
import StatusBadge from '@/components/admin/shared/StatusBadge.vue'
import { fmtDate, timeRange, initials } from '@/utils/format'
import { RESERVATION_STATUS } from '@/data/admin/adminReservations'

defineProps({
  rows: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['open', 'cancel', 'check-in', 'check-out'])

const columns = [
  { key: 'code', label: 'Kode', class: 'hidden xl:table-cell' },
  { key: 'student', label: 'Mahasiswa' },
  { key: 'room', label: 'Ruangan' },
  { key: 'when', label: 'Tanggal dan waktu' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '', class: 'w-px' }
]

const cancellable = (row) => row.status === 'waiting' || row.status === 'active'
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    :loading="loading"
    row-key="code"
    empty-title="Tidak ada reservasi yang cocok."
    empty-text="Ubah filter atau kata kunci."
    @row-click="emit('open', $event)"
  >
    <template #cell-code="{ row }">
      <span class="tnum text-[13px] text-ink-700">{{ row.code }}</span>
    </template>

    <template #cell-student="{ row }">
      <p class="text-sm font-medium text-ink-900">{{ row.student?.name ?? '—' }}</p>
      <p class="tnum text-[12px] text-ink-500">{{ row.student?.nim ?? '—' }}</p>
    </template>

    <template #cell-room="{ row }">
      <p class="text-sm text-ink-900">{{ row.room?.name ?? '—' }}</p>
      <p class="text-[12px] text-ink-500">{{ row.room?.building }}, Lantai {{ row.room?.floor }}</p>
    </template>

    <template #cell-when="{ row }">
      <p class="text-sm text-ink-900">{{ fmtDate(row.start) }}</p>
      <p class="tnum text-[12px] text-ink-500">{{ timeRange(row.start, row.end) }}</p>
    </template>

    <template #cell-status="{ row }">
      <StatusBadge :variant="RESERVATION_STATUS[row.status].variant" :label="RESERVATION_STATUS[row.status].label" />
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2" @click.stop>
        <button
          v-if="row.status === 'waiting'"
          type="button"
          class="text-[13px] font-medium text-red-700 hover:underline"
          @click="emit('check-in', row)"
        >
          Check-in
        </button>
        <button
          v-else-if="row.status === 'active'"
          type="button"
          class="text-[13px] font-medium text-free-600 hover:underline"
          @click="emit('check-out', row)"
        >
          Check-out
        </button>
        <button
          type="button"
          class="text-[13px] font-medium text-red-700 hover:underline"
          @click="emit('open', row)"
        >
          Detail
        </button>
        <button
          v-if="cancellable(row)"
          type="button"
          class="text-[13px] font-medium text-red-600 hover:underline"
          @click="emit('cancel', row)"
        >
          Batalkan
        </button>
      </div>
    </template>

    <template #mobile="{ rows: mobileRows }">
      <button
        v-for="row in mobileRows"
        :key="row.code"
        type="button"
        class="block w-full border-b border-line py-4 text-left"
        @click="emit('open', row)"
      >
        <div class="flex items-start gap-3">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-[12px] font-semibold text-red-700">
            {{ initials(row.student?.name) }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-ink-900">{{ row.student?.name ?? '—' }}</p>
            <p class="tnum text-[12px] text-ink-500">{{ row.student?.nim ?? '—' }}</p>
          </div>
          <StatusBadge :variant="RESERVATION_STATUS[row.status].variant" :label="RESERVATION_STATUS[row.status].label" />
        </div>
        <p class="mt-2 text-[13px] text-ink-700">{{ row.room?.name }}</p>
        <p class="text-[12px] text-ink-500">{{ fmtDate(row.start) }} · {{ timeRange(row.start, row.end) }}</p>
      </button>
    </template>
  </DataTable>
</template>
