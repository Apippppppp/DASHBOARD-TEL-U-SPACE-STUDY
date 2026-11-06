<script setup>
import { computed, onMounted } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import RoomMonitoringCard from '@/components/admin/room/RoomMonitoringCard.vue'
import { useAdminSettingsStore } from '@/stores/admin/adminSettings'
import { useAdminReservationsStore } from '@/stores/admin/adminReservations'
import { useSensorsStore } from '@/stores/admin/sensors'
import { useBridgeSocket } from '@/composables/admin/useBridgeSocket'
import { useUrlFilters } from '@/composables/admin/useUrlFilters'
import { timeRange } from '@/utils/format'

const settings = useAdminSettingsStore()
const reservations = useAdminReservationsStore()
const sensors = useSensorsStore()
const { status } = useBridgeSocket()

const { filters } = useUrlFilters({ ruangan: '' })

onMounted(() => {
  if (!settings.rooms.length) settings.fetchRooms()
  if (!reservations.rows.length) reservations.fetch()
})

const rooms = computed(() => settings.rooms.filter((r) => r.active))
const selected = computed(() => rooms.value.find((r) => r.id === filters.ruangan))
const visibleRooms = computed(() => (selected.value ? [selected.value] : rooms.value))

const now = new Date()
const activeReservationFor = (roomId) =>
  reservations.enriched.find(
    (r) => r.roomId === roomId && r.status === 'active' && new Date(r.start) <= now && new Date(r.end) >= now
  )

const usageOf = (room) => (activeReservationFor(room.id) ? 'Digunakan' : 'Kosong')
const sensorOf = (room) => (room.deviceId ? sensors.devices[room.deviceId] || null : null)

const motionWithoutBooking = computed(() => {
  if (!selected.value) return false
  const sensor = sensorOf(selected.value)
  return !!sensor?.latest?.motion && !activeReservationFor(selected.value.id)
})

function selectRoom(id) {
  filters.ruangan = id
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="status === 'disconnected'"
      role="alert"
      class="flex items-start gap-3 rounded-md border border-busy-600 bg-busy-50 px-4 py-3 text-sm text-busy-600"
    >
      <AlertTriangle :size="18" class="mt-0.5 shrink-0" />
      <p>Server monitoring terputus. Data tidak diperbarui sampai koneksi pulih.</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="h-9 rounded-md border px-3 text-[13px] font-medium"
        :class="!filters.ruangan ? 'border-red-600 bg-red-50 text-red-700' : 'border-line text-ink-700 hover:bg-surface'"
        @click="selectRoom('')"
      >
        Semua
      </button>
      <button
        v-for="room in rooms"
        :key="room.id"
        type="button"
        class="flex h-9 items-center gap-2 rounded-md border px-3 text-[13px] font-medium"
        :class="filters.ruangan === room.id ? 'border-red-600 bg-red-50 text-red-700' : 'border-line text-ink-700 hover:bg-surface'"
        @click="selectRoom(room.id)"
      >
        {{ room.name }}
        <span
          v-if="room.deviceId"
          class="h-1.5 w-1.5 rounded-full"
          :class="sensors.bridgeConnected && sensors.devices[room.deviceId] ? 'bg-free-600' : 'bg-ink-400'"
        />
      </button>
    </div>

    <div v-if="selected" class="rounded-lg border border-line p-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="font-display text-lg font-semibold">{{ selected.name }}</h2>
          <p class="text-[13px] text-ink-500">{{ selected.building }}, Lantai {{ selected.floor }}</p>
        </div>
        <span class="text-[13px] text-ink-700">{{ usageOf(selected) }}</span>
      </div>
      <p class="mt-2 text-[13px] text-ink-700">
        <template v-if="activeReservationFor(selected.id)">
          Reservasi saat ini: {{ activeReservationFor(selected.id).student?.name }},
          {{ timeRange(activeReservationFor(selected.id).start, activeReservationFor(selected.id).end) }}
        </template>
        <template v-else>Tidak ada reservasi aktif saat ini.</template>
      </p>
      <p v-if="motionWithoutBooking" class="mt-1 text-[13px] text-busy-600">
        Ada gerakan tanpa reservasi aktif.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2" :class="selected ? '' : 'xl:grid-cols-3'">
      <RoomMonitoringCard
        v-for="room in visibleRooms"
        :key="room.id"
        :room="room"
        :sensor="sensorOf(room)"
        :bridge-connected="sensors.bridgeConnected"
        :usage="usageOf(room)"
        :full="!!selected"
        @open="selectRoom(room.id)"
      />
    </div>
  </div>
</template>