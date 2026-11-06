<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUpDown } from 'lucide-vue-next'
import ReservationFilters from '@/components/admin/reservation/ReservationFilters.vue'
import ReservationTable from '@/components/admin/reservation/ReservationTable.vue'
import ReservationDrawer from '@/components/admin/reservation/ReservationDrawer.vue'
import FilterChips from '@/components/admin/shared/FilterChips.vue'
import Pagination from '@/components/admin/shared/Pagination.vue'
import { useAdminReservationsStore } from '@/stores/admin/adminReservations'
import { useAdminSettingsStore } from '@/stores/admin/adminSettings'
import { useToastStore } from '@/stores/toast'
import { useUrlFilters } from '@/composables/admin/useUrlFilters'
import { RESERVATION_STATUS } from '@/data/admin/adminReservations'
import { fmtDate } from '@/utils/format'

const reservations = useAdminReservationsStore()
const settings = useAdminSettingsStore()
const toast = useToastStore()
const route = useRoute()

const { filters, reset } = useUrlFilters({
  q: '',
  room: '',
  date: '',
  customDate: '',
  status: ''
})

const sortAsc = ref(true)
const page = ref(1)
const perPage = 10
const drawerOpen = ref(false)
const selected = ref(null)

onMounted(async () => {
  if (!reservations.rows.length) await reservations.fetch()
  if (!settings.rooms.length) settings.fetchRooms()
  const code = route.query.kode
  if (typeof code === 'string') {
    const found = reservations.enriched.find((r) => r.code === code)
    if (found) open(found)
  }
})

const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

const matchesDate = (r) => {
  if (!filters.date) return true
  const d = startOfDay(r.start)
  const today = startOfDay(new Date())
  if (filters.date === 'today') return d.getTime() === today.getTime()
  if (filters.date === 'tomorrow') {
    const t = new Date(today)
    t.setDate(t.getDate() + 1)
    return d.getTime() === t.getTime()
  }
  if (filters.date === 'next7') {
    const end = new Date(today)
    end.setDate(end.getDate() + 7)
    return d >= today && d < end
  }
  if (filters.date === 'custom' && filters.customDate) {
    return d.getTime() === startOfDay(filters.customDate).getTime()
  }
  return true
}

const filtered = computed(() => {
  const q = filters.q.trim().toLowerCase()
  const rows = reservations.enriched.filter((r) => {
    if (q && !`${r.student?.name ?? ''} ${r.student?.nim ?? ''}`.toLowerCase().includes(q)) return false
    if (filters.room && r.roomId !== filters.room) return false
    if (filters.status && r.status !== filters.status) return false
    if (!matchesDate(r)) return false
    return true
  })
  return rows.sort((a, b) => {
    const diff = new Date(a.start) - new Date(b.start)
    return sortAsc.value ? diff : -diff
  })
})

const paged = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

watch([() => filters.q, () => filters.room, () => filters.date, () => filters.customDate, () => filters.status], () => {
  page.value = 1
})

const chips = computed(() => {
  const out = []
  if (filters.q) out.push({ key: 'q', label: `“${filters.q}”` })
  if (filters.room) out.push({ key: 'room', label: settings.rooms.find((r) => r.id === filters.room)?.name || 'Ruangan' })
  if (filters.date) {
    const labels = { today: 'Hari ini', tomorrow: 'Besok', next7: '7 hari ke depan', custom: filters.customDate ? fmtDate(filters.customDate) : 'Pilih tanggal' }
    out.push({ key: 'date', label: labels[filters.date] })
  }
  if (filters.status) out.push({ key: 'status', label: RESERVATION_STATUS[filters.status]?.label || filters.status })
  return out
})

function removeChip(key) {
  if (key === 'date') filters.customDate = ''
  filters[key] = ''
}

function clearFilters() {
  reset()
}

function open(r) {
  selected.value = r
  drawerOpen.value = true
}

async function cancel(r) {
  await reservations.cancel(r.code, 'Dibatalkan petugas')
  toast.push('Reservasi dibatalkan.')
  drawerOpen.value = false
}

async function checkIn(r) {
  await reservations.checkIn(r.code)
  toast.push('Check-in dicatat.')
  drawerOpen.value = false
}

async function checkOut(r) {
  await reservations.checkOut(r.code)
  toast.push('Check-out dicatat.')
  drawerOpen.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-lg border border-line p-4">
      <ReservationFilters :filters="filters" :rooms="settings.rooms" />
      <div class="mt-3">
        <FilterChips :chips="chips" @remove="removeChip" @clear="clearFilters" />
      </div>
    </div>

    <div class="flex items-center justify-between gap-3">
      <p class="text-[13px] text-ink-500">
        Menampilkan {{ filtered.length }} reservasi
      </p>
      <button
        type="button"
        class="flex h-9 items-center gap-2 rounded-md border border-line px-3 text-[13px] text-ink-700 hover:bg-surface"
        @click="sortAsc = !sortAsc"
      >
        <ArrowUpDown :size="15" />
        {{ sortAsc ? 'Terdekat dulu' : 'Terbaru dulu' }}
      </button>
    </div>

    <div class="rounded-lg border border-line">
      <ReservationTable
        :rows="paged"
        :loading="reservations.loading"
        @open="open"
        @cancel="open"
        @check-in="checkIn"
        @check-out="checkOut"
      />
      <div class="px-3">
        <Pagination :page="page" :total="filtered.length" :per-page="perPage" @update:page="page = $event" />
      </div>
    </div>

    <ReservationDrawer
      :open="drawerOpen"
      :reservation="selected"
      @close="drawerOpen = false"
      @cancel="cancel"
      @check-in="checkIn"
      @check-out="checkOut"
    />
  </div>
</template>