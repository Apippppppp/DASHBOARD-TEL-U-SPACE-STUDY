<script setup>
import DataTable from '@/components/admin/shared/DataTable.vue'
import StatusBadge from '@/components/admin/shared/StatusBadge.vue'
import { fmtDate, fmtTime } from '@/utils/format'

defineProps({
  rows: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  emptyTitle: { type: String, default: 'Belum ada catatan akses.' },
  emptyText: { type: String, default: '' }
})
const emit = defineEmits(['open-booking'])

const columns = [
  { key: 'at', label: 'Waktu' },
  { key: 'student', label: 'Mahasiswa' },
  { key: 'room', label: 'Ruangan' },
  { key: 'method', label: 'Metode' },
  { key: 'result', label: 'Hasil' },
  { key: 'code', label: 'Reservasi', class: 'hidden xl:table-cell' }
]
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    :loading="loading"
    row-key="id"
    :empty-title="emptyTitle"
    :empty-text="emptyText"
  >
    <template #cell-at="{ row }">
      <p class="text-sm text-ink-900">{{ fmtDate(row.at) }}</p>
      <p class="tnum text-[12px] text-ink-500">{{ fmtTime(row.at) }}</p>
    </template>

    <template #cell-student="{ row }">
      <p class="text-sm font-medium text-ink-900">{{ row.studentName }}</p>
      <p v-if="row.nim" class="tnum text-[12px] text-ink-500">{{ row.nim }}</p>
    </template>

    <template #cell-room="{ row }">
      <span class="text-sm text-ink-900">{{ row.roomName }}</span>
    </template>

    <template #cell-method="{ row }">
      <span class="text-sm text-ink-700">{{ row.method }}</span>
    </template>

    <template #cell-result="{ row }">
      <StatusBadge :variant="row.result === 'ok' ? 'ok' : 'denied'" :label="row.result === 'ok' ? 'Berhasil' : 'Ditolak'" />
      <p v-if="row.reason" class="mt-1 text-[12px] text-ink-500">{{ row.reason }}</p>
    </template>

    <template #cell-code="{ row }">
      <button
        v-if="row.code"
        type="button"
        class="tnum text-[13px] font-medium text-red-700 hover:underline"
        @click="emit('open-booking', row.code)"
      >
        {{ row.code }}
      </button>
      <span v-else class="text-[13px] text-ink-400">—</span>
    </template>

    <template #mobile="{ rows: mobileRows }">
      <div v-for="row in mobileRows" :key="row.id" class="border-b border-line py-4">
        <div class="flex items-center justify-between gap-3">
          <p class="tnum text-[13px] text-ink-500">{{ fmtDate(row.at) }} {{ fmtTime(row.at) }}</p>
          <StatusBadge :variant="row.result === 'ok' ? 'ok' : 'denied'" :label="row.result === 'ok' ? 'Berhasil' : 'Ditolak'" />
        </div>
        <p class="mt-1 text-sm font-medium text-ink-900">{{ row.studentName }}</p>
        <p class="text-[12px] text-ink-500">{{ row.roomName }} · {{ row.method }}</p>
        <p v-if="row.reason" class="mt-1 text-[12px] text-ink-500">{{ row.reason }}</p>
      </div>
    </template>
  </DataTable>
</template>
