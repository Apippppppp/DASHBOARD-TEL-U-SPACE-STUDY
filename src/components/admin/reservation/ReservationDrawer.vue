<script setup>
import { computed, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import SideDrawer from '@/components/admin/shared/SideDrawer.vue'
import StatusBadge from '@/components/admin/shared/StatusBadge.vue'
import ConfirmDialog from '@/components/admin/shared/ConfirmDialog.vue'
import { RESERVATION_STATUS } from '@/data/admin/adminReservations'
import { fmtDate, fmtDateTime, timeRange, initials } from '@/utils/format'

const props = defineProps({
  open: { type: Boolean, default: false },
  reservation: { type: Object, default: null }
})
const emit = defineEmits(['close', 'cancel', 'check-in', 'check-out'])

const confirmOpen = ref(false)
const busy = ref(false)

const cancellable = computed(
  () => props.reservation && (props.reservation.status === 'waiting' || props.reservation.status === 'active')
)

watch(
  () => props.open,
  () => {
    confirmOpen.value = false
    busy.value = false
  }
)

const durationHours = computed(() => {
  if (!props.reservation) return 0
  const ms = new Date(props.reservation.end) - new Date(props.reservation.start)
  return Math.round((ms / 3600000) * 10) / 10
})

async function doCancel() {
  busy.value = true
  emit('cancel', props.reservation)
  busy.value = false
  confirmOpen.value = false
}
</script>

<template>
  <SideDrawer :open="open" :title="reservation?.code || 'Detail reservasi'" @close="emit('close')">
    <div v-if="reservation" class="flex h-full flex-col">
      <div class="flex items-start justify-between gap-3 border-b border-line p-5">
        <div>
          <p class="tnum text-[13px] text-ink-500">{{ reservation.code }}</p>
          <StatusBadge
            class="mt-1"
            :variant="RESERVATION_STATUS[reservation.status].variant"
            :label="RESERVATION_STATUS[reservation.status].label"
          />
        </div>
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-md text-ink-500 hover:bg-surface"
          aria-label="Tutup"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="flex-1 space-y-5 overflow-y-auto p-5">
        <div v-if="reservation.cancelReason" class="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {{ reservation.cancelReason }}
        </div>

        <div class="flex items-center gap-3 rounded-lg border border-line p-3">
          <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-50 font-display font-semibold text-red-700">
            {{ initials(reservation.student?.name) }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-ink-900">{{ reservation.student?.name ?? '—' }}</p>
            <p class="tnum text-[12px] text-ink-500">{{ reservation.student?.nim ?? '—' }}</p>
            <p class="truncate text-[12px] text-ink-500">{{ reservation.student?.email }}</p>
            <p class="text-[12px] text-ink-500">{{ reservation.student?.prodi }}</p>
          </div>
        </div>

        <dl class="space-y-2 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Ruangan</dt>
            <dd class="text-right text-ink-900">{{ reservation.room?.name ?? '—' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Lokasi</dt>
            <dd class="text-right text-ink-900">{{ reservation.room?.building }}, Lantai {{ reservation.room?.floor }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Tanggal</dt>
            <dd class="text-right text-ink-900">{{ fmtDate(reservation.start) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Waktu</dt>
            <dd class="tnum text-right text-ink-900">{{ timeRange(reservation.start, reservation.end) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Durasi</dt>
            <dd class="text-right text-ink-900">{{ durationHours }} jam</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Peserta</dt>
            <dd class="text-right text-ink-900">{{ reservation.participants }} orang</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Keperluan</dt>
            <dd class="text-right text-ink-900">{{ reservation.purpose }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Dibuat pada</dt>
            <dd class="text-right text-ink-900">{{ fmtDateTime(reservation.createdAt) }}</dd>
          </div>
        </dl>

        <div>
          <p class="mb-3 text-[12px] font-medium text-ink-500">Riwayat status</p>
          <ol class="relative space-y-4 border-l border-line pl-4">
            <li v-for="(h, i) in reservation.statusHistory" :key="i" class="relative">
              <span class="absolute top-1 -left-[21px] h-2 w-2 rounded-full bg-red-600" />
              <p class="text-sm text-ink-900">{{ h.label }}</p>
              <p class="tnum text-[12px] text-ink-500">{{ fmtDateTime(h.at) }}</p>
            </li>
          </ol>
        </div>
      </div>

      <div class="space-y-2 border-t border-line p-5">
        <button
          v-if="reservation.status === 'waiting'"
          type="button"
          class="h-10 w-full rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700"
          @click="emit('check-in', reservation)"
        >
          Check-in manual
        </button>
        <button
          v-else-if="reservation.status === 'active'"
          type="button"
          class="h-10 w-full rounded-md border border-free-600 text-sm font-medium text-free-600 hover:bg-free-50"
          @click="emit('check-out', reservation)"
        >
          Check-out manual
        </button>
        <button
          v-if="cancellable"
          type="button"
          class="h-10 w-full rounded-md border border-red-600 text-sm font-medium text-red-600 hover:bg-red-50"
          @click="confirmOpen = true"
        >
          Batalkan reservasi
        </button>
      </div>
    </div>

    <ConfirmDialog
      :open="confirmOpen"
      title="Batalkan reservasi?"
      :message="`Batalkan reservasi ${reservation?.code} milik ${reservation?.student?.name ?? 'mahasiswa'}? Mahasiswa akan melihat statusnya menjadi Dibatalkan.`"
      confirm-label="Batalkan reservasi"
      cancel-label="Kembali"
      danger
      :busy="busy"
      @confirm="doCancel"
      @cancel="confirmOpen = false"
    />
  </SideDrawer>
</template>
