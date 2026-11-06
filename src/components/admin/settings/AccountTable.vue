<script setup>
import DataTable from '@/components/admin/shared/DataTable.vue'
import StatusBadge from '@/components/admin/shared/StatusBadge.vue'
import { fmtDateTime } from '@/utils/format'

defineProps({ accounts: { type: Array, required: true }, loading: { type: Boolean } })
const emit = defineEmits(['edit', 'reset', 'toggle'])

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Peran' },
  { key: 'status', label: 'Status' },
  { key: 'lastLogin', label: 'Login terakhir', class: 'hidden lg:table-cell' },
  { key: 'actions', label: '', class: 'w-px' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="accounts" :loading="loading" row-key="id" empty-title="Belum ada akun.">
    <template #cell-name="{ row }">
      <span class="text-sm font-medium text-ink-900">{{ row.name }}</span>
    </template>
    <template #cell-email="{ row }">
      <span class="text-[13px] text-ink-700">{{ row.email }}</span>
    </template>
    <template #cell-role="{ row }">
      <StatusBadge :variant="row.role === 'admin' ? 'active' : 'warning'" :label="row.role === 'admin' ? 'Admin' : 'Petugas'" />
    </template>
    <template #cell-status="{ row }">
      <StatusBadge :variant="row.active ? 'ok' : 'offline'" :label="row.active ? 'Aktif' : 'Nonaktif'" />
    </template>
    <template #cell-lastLogin="{ row }">
      <span class="tnum text-[13px] text-ink-500">{{ row.lastLogin ? fmtDateTime(row.lastLogin) : '—' }}</span>
    </template>
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <button type="button" class="text-[13px] font-medium text-red-700 hover:underline" @click="emit('edit', row)">Ubah</button>
        <button type="button" class="text-[13px] font-medium text-ink-700 hover:underline" @click="emit('reset', row)">Atur ulang kata sandi</button>
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
          <StatusBadge :variant="row.role === 'admin' ? 'active' : 'warning'" :label="row.role === 'admin' ? 'Admin' : 'Petugas'" />
        </div>
        <p class="mt-1 text-[13px] text-ink-700">{{ row.email }}</p>
        <p class="text-[12px] text-ink-500">{{ row.active ? 'Aktif' : 'Nonaktif' }}</p>
      </div>
    </template>
  </DataTable>
</template>
