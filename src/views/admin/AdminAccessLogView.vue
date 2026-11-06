<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Download } from 'lucide-vue-next'
import AccessLogTable from '@/components/admin/access/AccessLogTable.vue'
import FilterChips from '@/components/admin/shared/FilterChips.vue'
import Pagination from '@/components/admin/shared/Pagination.vue'
import SearchInput from '@/components/admin/shared/SearchInput.vue'
import { useAccessLogsStore } from '@/stores/admin/accessLogs'
import { useAdminSettingsStore } from '@/stores/admin/adminSettings'
import { useUrlFilters } from '@/composables/admin/useUrlFilters'
import { useToastStore } from '@/stores/toast'
import { toCsv, downloadCsv } from '@/utils/csv'
import { fmtDate, fmtTime } from '@/utils/format'
import { useRouter } from 'vue-router'

const logs = useAccessLogsStore()
const settings = useAdminSettingsStore()
const toast = useToastStore()
const router = useRouter()

const { filters, reset } = useUrlFilters({
  q: '',
  room: '',
  range: '',
  customDate: '',
  result: ''
})

const page = ref(1)
const perPage = 20

onMounted(() => {
  if (!logs.rows.length) logs.fetch()
  if (!settings.rooms.length) settings.fetchRooms()
})

const selectClass = 'h-10 rounded-md border border-line bg-white px-3 text-sm text-ink-900 focus:border-red-600 focus:outline-none'

const matchesRange = (row) => {
  if (!filters.range) return true
  const at = new Date(row.at)
  const now = new Date()
  const days = (now - at) / 86400000
  if (filters.range === 'today') return days < 1
  if (filters.range === '7') return days <= 7
  if (filters.range === '30') return days <= 30
  if (filters.range === 'custom' && filters.customDate) {
    const d = new Date(filters.customDate)
    return at.getFullYear() === d.getFullYear() && at.getMonth() === d.getMonth() && at.getDate() === d.getDate()
  }
  return true
}

const filtered = computed(() => {
  const q = filters.q.trim().toLowerCase()
  return logs.rows.filter((row) => {
    if (q && !`${row.studentName} ${row.nim ?? ''}`.toLowerCase().includes(q)) return false
    if (filters.room && row.roomId !== filters.room) return false
    if (filters.result && row.result !== filters.result) return false
    if (!matchesRange(row)) return false
    return true
  })
})

const paged = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

watch([() => filters.q, () => filters.room, () => filters.range, () => filters.customDate, () => filters.result], () => {
  page.value = 1
})

const chips = computed(() => {
  const out = []
  if (filters.q) out.push({ key: 'q', label: `“${filters.q}”` })
  if (filters.room) out.push({ key: 'room', label: settings.rooms.find((r) => r.id === filters.room)?.name || 'Ruangan' })
  if (filters.range) {
    const labels = { today: 'Hari ini', 7: '7 hari', 30: '30 hari', custom: filters.customDate ? fmtDate(filters.customDate) : 'Pilih tanggal' }
    out.push({ key: 'range', label: labels[filters.range] })
  }
  if (filters.result) out.push({ key: 'result', label: filters.result === 'ok' ? 'Berhasil' : 'Ditolak' })
  return out
})

function removeChip(key) {
  if (key === 'range') filters.customDate = ''
  filters[key] = ''
}

function exportCsv() {
  const columns = [
    { label: 'Waktu', value: (r) => `${fmtDate(r.at)} ${fmtTime(r.at)}` },
    { label: 'Mahasiswa', value: (r) => r.studentName },
    { label: 'NIM', value: (r) => r.nim ?? '' },
    { label: 'Ruangan', value: (r) => r.roomName },
    { label: 'Metode', value: (r) => r.method },
    { label: 'Hasil', value: (r) => (r.result === 'ok' ? 'Berhasil' : 'Ditolak') },
    { label: 'Alasan', value: (r) => r.reason },
    { label: 'Kode reservasi', value: (r) => r.code ?? '' }
  ]
  const today = new Date().toISOString().slice(0, 10)
  downloadCsv(`riwayat-akses-${today}.csv`, toCsv(columns, filtered.value))
  toast.push('CSV diunduh.')
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-lg border border-line p-4">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="flex-1">
          <SearchInput v-model="filters.q" placeholder="Cari nama atau NIM" />
        </div>
        <div class="flex flex-wrap gap-2">
          <select v-model="filters.room" :class="selectClass" aria-label="Filter ruangan">
            <option value="">Semua ruangan</option>
            <option v-for="r in settings.rooms" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
          <select v-model="filters.range" :class="selectClass" aria-label="Rentang tanggal">
            <option value="">Semua tanggal</option>
            <option value="today">Hari ini</option>
            <option value="7">7 hari</option>
            <option value="30">30 hari</option>
            <option value="custom">Pilih tanggal</option>
          </select>
          <input v-if="filters.range === 'custom'" v-model="filters.customDate" type="date" :class="selectClass" aria-label="Pilih tanggal" />
          <select v-model="filters.result" :class="selectClass" aria-label="Filter hasil">
            <option value="">Semua hasil</option>
            <option value="ok">Berhasil</option>
            <option value="denied">Ditolak</option>
          </select>
          <button
            type="button"
            class="flex h-10 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
            @click="exportCsv"
          >
            <Download :size="17" /> Ekspor CSV
          </button>
        </div>
      </div>
      <div class="mt-3">
        <FilterChips :chips="chips" @remove="removeChip" @clear="reset" />
      </div>
    </div>

    <p class="text-[13px] text-ink-500">Menampilkan {{ filtered.length }} catatan</p>

    <div class="rounded-lg border border-line">
      <AccessLogTable
        :rows="paged"
        :loading="logs.loading"
        :empty-title="chips.length ? 'Tidak ada catatan yang cocok.' : 'Belum ada catatan akses.'"
        :empty-text="chips.length ? 'Ubah filter atau rentang tanggal.' : ''"
        @open-booking="router.push({ path: '/admin/reservasi', query: { kode: $event } })"
      />
      <div class="px-3">
        <Pagination :page="page" :total="filtered.length" :per-page="perPage" @update:page="page = $event" />
      </div>
    </div>
  </div>
</template>