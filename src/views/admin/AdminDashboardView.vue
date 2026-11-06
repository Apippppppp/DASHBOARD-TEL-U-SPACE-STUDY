<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ScanLine, CalendarCheck } from 'lucide-vue-next'
import StatStrip from '@/components/admin/dashboard/StatStrip.vue'
import RoomTimeline from '@/components/admin/dashboard/RoomTimeline.vue'
import PendingCheckinList from '@/components/admin/dashboard/PendingCheckinList.vue'
import RoomMonitoringCard from '@/components/admin/room/RoomMonitoringCard.vue'
import ReservationTable from '@/components/admin/reservation/ReservationTable.vue'
import ReservationDrawer from '@/components/admin/reservation/ReservationDrawer.vue'
import { useAdminReservationsStore } from '@/stores/admin/adminReservations'
import { useAdminSettingsStore } from '@/stores/admin/adminSettings'
import { useSensorsStore } from '@/stores/admin/sensors'
import { useViewDateStore } from '@/stores/admin/viewDate'
import { useToastStore } from '@/stores/toast'
import { fmtDate } from '@/utils/format'

const router = useRouter()
const reservations = useAdminReservationsStore()
const settings = useAdminSettingsStore()
const sensors = useSensorsStore()
const viewDate = useViewDateStore()
const toast = useToastStore()

const now = ref(new Date())
const drawerOpen = ref(false)
const selected = ref(null)
let timer

onMounted(() => {
  if (!reservations.rows.length) reservations.fetch()
  if (!settings.rooms.length) settings.fetchRooms()
  timer = setInterval(() => (now.value = new Date()), 30000)
})
onUnmounted(() => clearInterval(timer))

const day = computed(() => viewDate.asDate)
const isToday = computed(() => viewDate.isToday)

const sameDay = (iso) => {
  const x = new Date(iso)
  const d = day.value
  return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth() && x.getDate() === d.getDate()
}

const activeRooms = computed(() => settings.rooms.filter((r) => r.active))

const dayReservations = computed(() =>
  reservations.enriched.filter((r) => sameDay(r.start) && r.status !== 'cancelled')
)

const usedRoomIds = computed(() => {
  if (isToday.value) {
    return new Set(
      reservations.enriched
        .filter(
          (r) => r.status === 'active' && new Date(r.start) <= now.value && new Date(r.end) >= now.value
        )
        .map((r) => r.roomId)
    )
  }
  return new Set(dayReservations.value.map((r) => r.roomId))
})

const waitingCheckin = computed(() => {
  const rows = reservations.enriched.filter((r) => r.status === 'waiting' && sameDay(r.start))
  const scoped = isToday.value
    ? rows.filter((r) => new Date(r.start).getTime() <= now.value.getTime() + 15 * 60000)
    : rows
  return scoped.sort((a, b) => new Date(a.start) - new Date(b.start))
})

const lateCount = computed(
  () => (isToday.value ? waitingCheckin.value.filter((r) => new Date(r.start) < now.value).length : 0)
)

const cells = computed(() => [
  {
    key: 'rooms',
    label: 'Total ruangan',
    value: activeRooms.value.length,
    note: `${activeRooms.value.filter((r) => r.deviceId).length} perangkat terpasang`,
    to: { path: '/admin/monitoring' }
  },
  {
    key: 'today',
    label: isToday.value ? 'Reservasi hari ini' : `Reservasi ${fmtDate(viewDate.date)}`,
    value: dayReservations.value.length,
    note: `${dayReservations.value.filter((r) => r.status === 'active').length} aktif, ${dayReservations.value.filter((r) => r.status === 'waiting').length} menunggu`,
    to: { path: '/admin/reservasi' }
  },
  {
    key: 'inuse',
    label: 'Ruangan digunakan',
    value: usedRoomIds.value.size,
    note: `dari ${activeRooms.value.length} ruangan`,
    to: { path: '/admin/monitoring' }
  },
  {
    key: 'pending',
    label: 'Menunggu check-in',
    value: waitingCheckin.value.length,
    note: lateCount.value ? `${lateCount.value} terlambat` : 'Tidak ada yang terlambat',
    to: { path: '/admin/reservasi', query: { status: 'waiting' } }
  }
])

const monitoringRooms = computed(() => activeRooms.value.slice(0, 3))
const usageOf = (room) => (usedRoomIds.value.has(room.id) ? 'Digunakan' : 'Kosong')
const sensorOf = (room) => (room.deviceId ? sensors.devices[room.deviceId] || null : null)

const timelineRows = computed(() =>
  activeRooms.value.map((room) => ({
    room,
    reservations: reservations.enriched.filter(
      (r) => r.roomId === room.id && sameDay(r.start) && r.status !== 'cancelled'
    )
  }))
)

const pendingItems = computed(() =>
  waitingCheckin.value
    .slice(0, 5)
    .map((r) => ({ reservation: r, late: isToday.value && new Date(r.start) < now.value }))
)

const recent = computed(() =>
  [...reservations.enriched]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
)

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
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-ink-500">
        {{ isToday ? 'Ringkasan operasional hari ini.' : `Menampilkan data ${fmtDate(viewDate.date)}.` }}
      </p>
      <div class="grid grid-cols-2 gap-2 sm:flex">
        <button
          type="button"
          class="flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
          @click="router.push('/admin/scan')"
        >
          <ScanLine :size="18" /> Pindai QR
        </button>
        <button
          type="button"
          class="flex h-10 items-center justify-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-ink-700 hover:bg-surface"
          @click="router.push('/admin/reservasi')"
        >
          <CalendarCheck :size="18" /> Kelola reservasi
        </button>
      </div>
    </div>

    <StatStrip :cells="cells" />

    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="font-display text-lg font-semibold">Monitoring ruangan</h2>
        <button type="button" class="text-[13px] font-medium text-red-700 hover:underline" @click="router.push('/admin/monitoring')">
          Lihat semua
        </button>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RoomMonitoringCard
          v-for="room in monitoringRooms"
          :key="room.id"
          :room="room"
          :sensor="sensorOf(room)"
          :bridge-connected="sensors.bridgeConnected"
          :usage="usageOf(room)"
          @open="router.push({ path: '/admin/monitoring', query: { ruangan: room.id } })"
        />
      </div>
    </section>

    <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div class="xl:col-span-2">
        <h2 class="mb-3 font-display text-lg font-semibold">
          Lini waktu {{ isToday ? 'hari ini' : fmtDate(viewDate.date) }}
        </h2>
        <div class="rounded-lg border border-line p-4">
          <RoomTimeline :rows="timelineRows" :now="isToday ? now : null" @open="open" />
        </div>
      </div>
      <PendingCheckinList :items="pendingItems" @open="open" />
    </section>

    <section>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="font-display text-lg font-semibold">Aktivitas reservasi terbaru</h2>
        <button type="button" class="text-[13px] font-medium text-red-700 hover:underline" @click="router.push('/admin/reservasi')">
          Lihat semua
        </button>
      </div>
      <div class="rounded-lg border border-line">
        <ReservationTable
          :rows="recent"
          :loading="reservations.loading"
          @open="open"
          @cancel="open"
          @check-in="checkIn"
          @check-out="checkOut"
        />
      </div>
    </section>

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
