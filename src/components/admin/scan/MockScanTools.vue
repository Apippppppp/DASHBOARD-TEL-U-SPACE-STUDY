<script setup>
import { MOCK_QR_TOKENS } from '@/services/admin/accessService'

const emit = defineEmits(['test'])

// Hanya dirender pada mode mock (design-admin 8.4).
const buttons = [
  { kind: 'valid', token: MOCK_QR_TOKENS.valid, label: 'Valid' },
  { kind: 'denied', token: MOCK_QR_TOKENS.cancelled, label: 'Ditolak' },
  { kind: 'notStarted', token: MOCK_QR_TOKENS.notStarted, label: 'Belum mulai' },
  { kind: 'ended', token: MOCK_QR_TOKENS.ended, label: 'Berakhir' },
  { kind: 'error', token: MOCK_QR_TOKENS.error, label: 'Gagal' },
  { kind: 'unknown', token: MOCK_QR_TOKENS.unknown, label: 'Tidak dikenal' }
]
</script>

<template>
  <div class="rounded-lg border border-dashed border-line bg-surface p-3">
    <p class="text-[12px] font-medium text-ink-500">Mode simulasi</p>
    <div class="mt-2 flex flex-wrap gap-2">
      <button
        v-for="b in buttons"
        :key="b.kind"
        type="button"
        class="h-8 rounded-md border border-line bg-white px-3 text-[13px] font-medium text-ink-700 hover:bg-surface"
        @click="emit('test', b)"
      >
        {{ b.label }}
      </button>
    </div>
  </div>
</template>
