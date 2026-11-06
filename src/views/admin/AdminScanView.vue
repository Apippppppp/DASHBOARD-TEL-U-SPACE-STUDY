<script setup>
import { computed, ref } from 'vue'
import QrScannerPanel from '@/components/admin/scan/QrScannerPanel.vue'
import ManualCodeForm from '@/components/admin/scan/ManualCodeForm.vue'
import MockScanTools from '@/components/admin/scan/MockScanTools.vue'
import ScanResultPanel from '@/components/admin/scan/ScanResultPanel.vue'
import RecentScanList from '@/components/admin/scan/RecentScanList.vue'
import { validateQr } from '@/services/admin/accessService'
import { USE_MOCK } from '@/services/admin/http'
import { fmtTime } from '@/utils/format'

const result = ref(null)
const checking = ref(false)
const recent = ref([])
const lastCode = ref('')
const lastCodeAt = 0
let resumeTimer = null
const paused = ref(false)

// Alat simulasi tidak pernah ikut build produksi.
const SHOW_MOCK_TOOLS = import.meta.env.DEV && USE_MOCK

const scanningPaused = computed(() => checking.value || paused.value)

function pushRecent(res) {
  recent.value = [
    {
      at: fmtTime(new Date()),
      name: res.student?.name ?? 'Tidak dikenal',
      room: res.booking?.roomName ?? '—',
      ok: res.status === 'valid'
    },
    ...recent.value
  ].slice(0, 5)
}

async function handle(payload, source) {
  if (checking.value) return
  if (payload === lastCode.value && Date.now() - lastCodeAt < 10000) return
  lastCode.value = payload
  lastCodeAt = Date.now()
  checking.value = true
  paused.value = true
  clearTimeout(resumeTimer)
  try {
    const res = await validateQr(payload, source)
    result.value = res
    pushRecent(res)
  } catch {
    result.value = { status: 'error' }
    pushRecent({ status: 'error' })
  } finally {
    checking.value = false
    // Pindai lagi otomatis setelah 5 detik bila petugas tidak menutup hasil.
    resumeTimer = setTimeout(() => (paused.value = false), 5000)
  }
}

function next() {
  clearTimeout(resumeTimer)
  result.value = null
  paused.value = false
}

function retry() {
  const code = lastCode.value
  result.value = null
  paused.value = false
  lastCodeAt = 0
  if (code) handle(code, 'manual')
}

function onMockTest(b) {
  handle(b.token, 'camera')
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
    <div class="space-y-4 lg:col-span-7">
      <QrScannerPanel :paused="scanningPaused" @decoded="handle($event, 'camera')" />
      <ManualCodeForm @submit="handle($event, 'manual')" />
      <MockScanTools v-if="SHOW_MOCK_TOOLS" @test="onMockTest" />
    </div>

    <div class="space-y-4 lg:col-span-5">
      <ScanResultPanel :result="result" :checking="checking" @next="next" @retry="retry" />
      <RecentScanList :items="recent" />
    </div>
  </div>
</template>