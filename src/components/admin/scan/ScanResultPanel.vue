<script setup>
import { computed } from 'vue'
import { CheckCircle2, XCircle, Clock, WifiOff } from 'lucide-vue-next'
import { fmtTime, timeRange } from '@/utils/format'

const props = defineProps({
  result: { type: Object, default: null },
  checking: { type: Boolean, default: false }
})
const emit = defineEmits(['next', 'retry'])

const DENY_TEXT = {
  unknown_qr: 'QR tidak dikenal.',
  cancelled: 'Reservasi sudah dibatalkan.',
  already_checked_in: 'Check-in sudah tercatat untuk reservasi ini.',
  expired_token: 'QR sudah kedaluwarsa.'
}

const view = computed(() => {
  const r = props.result
  if (!r) return null
  switch (r.status) {
    case 'valid':
      return { tone: 'ok', icon: CheckCircle2, title: 'Akses valid', note: '', big: true }
    case 'denied':
      return { tone: 'danger', icon: XCircle, title: 'Akses ditolak', note: DENY_TEXT[r.reason] || 'QR tidak dikenal.', big: true }
    case 'not_started':
      return { tone: 'warn', icon: Clock, title: 'Reservasi belum dimulai', note: `QR aktif mulai ${fmtTime(r.activeFrom)}.`, big: true }
    case 'ended':
      return { tone: 'warn', icon: Clock, title: 'Reservasi sudah berakhir', note: `Berakhir pukul ${fmtTime(r.endedAt)}.`, big: true }
    case 'error':
      return { tone: 'error', icon: WifiOff, title: 'Tidak dapat memeriksa QR', note: 'Server tidak merespons. Coba lagi atau masukkan kode manual.', big: false }
    default:
      return null
  }
})

const toneClass = computed(() => {
  if (!view.value) return 'border-line bg-white'
  return {
    ok: 'border-free-600 bg-free-50',
    danger: 'border-red-600 bg-red-50',
    warn: 'border-busy-600 bg-busy-50',
    error: 'border-line bg-surface'
  }[view.value.tone]
})

const hasData = computed(() => ['valid', 'denied', 'not_started', 'ended'].includes(props.result?.status) && props.result?.booking)

const announcement = computed(() => {
  const r = props.result
  if (!r) return ''
  if (r.status === 'valid') {
    return `Akses valid. ${r.student?.name}, ${r.booking?.roomName}, ${timeRange(r.booking?.start, r.booking?.end)}.`
  }
  if (r.status === 'denied') return `Akses ditolak. ${DENY_TEXT[r.reason] || 'QR tidak dikenal.'}`
  if (r.status === 'not_started') return `Reservasi belum dimulai. QR aktif mulai ${fmtTime(r.activeFrom)}.`
  if (r.status === 'ended') return `Reservasi sudah berakhir. Berakhir pukul ${fmtTime(r.endedAt)}.`
  return 'Tidak dapat memeriksa QR. Server tidak merespons.'
})
</script>

<template>
  <div>
    <p class="mb-2 text-[12px] font-medium text-ink-500">Hasil validasi</p>

    <div
      class="rounded-lg border-2 p-5 transition-colors duration-150"
      :class="toneClass"
      aria-live="assertive"
    >
      <p class="sr-only">{{ announcement }}</p>

      <!-- Menunggu pemindaian -->
      <template v-if="!view">
        <p class="font-display text-base font-semibold text-ink-900">Menunggu pemindaian</p>
        <p class="mt-1 text-sm text-ink-500">Arahkan QR mahasiswa ke kamera.</p>
      </template>

      <template v-else>
        <component :is="view.icon" :size="view.big ? 64 : 48" class="text-current" :class="{
          'text-free-600': view.tone === 'ok',
          'text-red-600': view.tone === 'danger',
          'text-busy-600': view.tone === 'warn',
          'text-ink-500': view.tone === 'error'
        }" />
        <p
          class="mt-3 font-display font-semibold"
          :class="view.big ? 'text-[32px] leading-9' : 'text-xl'"
        >
          {{ view.title }}
        </p>
        <p v-if="view.note" class="mt-1 text-sm text-ink-700">{{ view.note }}</p>

        <dl v-if="hasData" class="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Nama mahasiswa</dt>
            <dd class="text-right font-medium text-ink-900">{{ result.student?.name ?? '—' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">NIM</dt>
            <dd class="tnum text-right text-ink-900">{{ result.student?.nim ?? '—' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Ruangan</dt>
            <dd class="text-right text-ink-900">{{ result.booking?.roomName }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Jadwal reservasi</dt>
            <dd class="tnum text-right text-ink-900">{{ timeRange(result.booking?.start, result.booking?.end) }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Status validasi</dt>
            <dd class="text-right text-ink-900">{{ view.title }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-ink-500">Hasil akses</dt>
            <dd class="text-right font-medium" :class="view.tone === 'ok' ? 'text-free-600' : 'text-red-600'">
              {{ view.tone === 'ok' ? 'Diberikan' : view.tone === 'error' ? '—' : 'Ditolak' }}
            </dd>
          </div>
        </dl>

        <button
          v-if="view.tone === 'error'"
          type="button"
          class="mt-4 h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
          @click="emit('retry')"
        >
          Coba lagi
        </button>
        <button
          v-else
          type="button"
          class="mt-5 h-11 w-full rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700"
          @click="emit('next')"
        >
          Pindai berikutnya
        </button>
      </template>
    </div>
  </div>
</template>
