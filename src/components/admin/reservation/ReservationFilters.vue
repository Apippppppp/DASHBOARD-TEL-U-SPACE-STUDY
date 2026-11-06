<script setup>
import SearchInput from '@/components/admin/shared/SearchInput.vue'

const props = defineProps({
  filters: { type: Object, required: true },
  rooms: { type: Array, default: () => [] }
})

const STATUS = [
  { value: '', label: 'Semua status' },
  { value: 'waiting', label: 'Menunggu' },
  { value: 'active', label: 'Aktif' },
  { value: 'done', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' }
]

const DATE = [
  { value: '', label: 'Semua tanggal' },
  { value: 'today', label: 'Hari ini' },
  { value: 'tomorrow', label: 'Besok' },
  { value: 'next7', label: '7 hari ke depan' },
  { value: 'custom', label: 'Pilih tanggal' }
]

const selectClass =
  'h-10 rounded-md border border-line bg-white px-3 text-sm text-ink-900 focus:border-red-600 focus:outline-none'
</script>

<template>
  <div class="space-y-3">
    <SearchInput v-model="filters.q" placeholder="Cari nama atau NIM mahasiswa" />
    <div class="flex flex-wrap items-center gap-2">
      <select v-model="filters.room" :class="selectClass" aria-label="Filter ruangan">
        <option value="">Semua ruangan</option>
        <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.name }}</option>
      </select>

      <select v-model="filters.date" :class="selectClass" aria-label="Filter tanggal">
        <option v-for="d in DATE" :key="d.value" :value="d.value">{{ d.label }}</option>
      </select>
      <input
        v-if="filters.date === 'custom'"
        v-model="filters.customDate"
        type="date"
        :class="selectClass"
        aria-label="Pilih tanggal"
      />

      <select v-model="filters.status" :class="selectClass" aria-label="Filter status">
        <option v-for="s in STATUS" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
    </div>
  </div>
</template>
