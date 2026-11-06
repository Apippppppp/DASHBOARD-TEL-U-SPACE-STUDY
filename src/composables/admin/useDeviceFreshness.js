import { computed, ref } from 'vue'
import { STALE_AFTER_MS, OFFLINE_AFTER_MS } from '@/config/monitoring'

// Satu ticker global per detik untuk semua kartu.
const now = ref(Date.now())
let timer = null
function ensureTicker() {
  if (timer) return
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}
ensureTicker()

/**
 * @param {import('vue').Ref<number>} receivedAt waktu terima di klien (ms)
 * @returns state: 'none' | 'ok' | 'stale' | 'offline'
 */
export function useDeviceFreshness(receivedAt) {
  const ageMs = computed(() => {
    const at = receivedAt?.value
    return at ? now.value - at : Infinity
  })
  const state = computed(() => {
    const at = receivedAt?.value
    if (!at) return 'none'
    if (ageMs.value <= STALE_AFTER_MS) return 'ok'
    if (ageMs.value <= OFFLINE_AFTER_MS) return 'stale'
    return 'offline'
  })
  return { now, ageMs, state }
}
