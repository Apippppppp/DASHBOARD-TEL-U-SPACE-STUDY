<script setup>
import DataTable from '@/components/admin/shared/DataTable.vue'
import StatusBadge from '@/components/admin/shared/StatusBadge.vue'

defineProps({ rooms: { type: Array, required: true }, loading: { type: Boolean } })
const emit = defineEmits(['edit', 'toggle'])

const TYPE_LABEL = {
  diskusi: 'Diskusi',
  'belajar-mandiri': 'Belajar Mandiri',
  rapat: 'Rapat',
  kolaborasi: 'Kolaborasi'
}

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'type', label: 'Tipe', class: 'hidden lg:table-cell' },
  { key: 'location', label: 'Lokasi', class: 'hidden xl:table-cell' },
  { key: 'capacity', label: 'Kapasitas', class: 'hidden lg:table-cell' },
  { key: 'hours', label: 'Jam buka', class: 'hidden xl:table-cell' },
  { key: 'device', label: 'Perangkat' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '', class: 'w-px' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="rooms" :loading="loading" empty-title="Belum ada ruangan.">
    <template #cell-name="{ row }">
      <span class="text-sm font-medium text-ink-900">{{ row.name }}</span>
    </template>
    <template #cell-type="{ row }">{{ TYPE_LABEL[row.type] || row.type }}</template>
    <template #cell-location="{ row }">{{ row.building }}, Lt {{ row.floor }}</template>
    <template #cell-capacity="{ row }">{{ row.capacityMin }}–{{ row.capacityMax }} orang</template>
    <template #cell-hours="{ row }">
      <span class="tnum">{{ String(row.openHour).padStart(2, '0') }}:00–{{ String(row.closeHour).padStart(2, '0') }}:00</span>
    </template>
    <template #cell-device="{ row }">
      <span class="text-sm" :class="row.deviceId ? 'text-free-600' : 'text-ink-500'">
        {{ row.deviceId ? 'Terpasang' : 'Belum' }}
      </span>
    </template>
    <template #cell-status="{ row }">
      <StatusBadge :variant="row.active ? 'active' : 'offline'" :label="row.active ? 'Aktif' : 'Nonaktif'" />
    </template>
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <button type="button" class="text-[13px] font-medium text-red-700 hover:underline" @click="emit('edit', row)">
          Ubah
        </button>
        <button
          type="button"
          class="text-[13px] font-medium hover:underline"
          :class="row.active ? 'text-red-600' : 'text-free-600'"
          @click="emit('toggle', row)"
        >
          {{ row.active ? 'Nonaktifkan' : 'Aktifkan' }}
        </button>
      </div>
    </template>
    <template #mobile="{ rows }">
      <div v-for="row in rows" :key="row.id" class="border-b border-line py-4">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-ink-900">{{ row.name }}</p>
          <StatusBadge :variant="row.active ? 'active' : 'offline'" :label="row.active ? 'Aktif' : 'Nonaktif'" />
        </div>
        <p class="mt-1 text-[12px] text-ink-500">
          {{ TYPE_LABEL[row.type] }} · {{ row.building }}, Lt {{ row.floor }} · {{ row.capacityMin }}–{{ row.capacityMax }} orang
        </p>
        <p class="text-[12px] text-ink-500">
          {{ row.deviceId ? 'Perangkat terpasang' : 'Belum ada perangkat' }}
        </p>
        <div class="mt-2 flex gap-3">
          <button type="button" class="text-[13px] font-medium text-red-700" @click="emit('edit', row)">Ubah</button>
        </div>
      </div>
    </template>
  </DataTable>
</template>
