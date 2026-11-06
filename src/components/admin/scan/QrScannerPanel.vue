<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Camera, ScanLine } from 'lucide-vue-next'
import { useCamera } from '@/composables/admin/useCamera'
import { useQrDecoder } from '@/composables/admin/useQrDecoder'

const props = defineProps({
  paused: { type: Boolean, default: false }
})
const emit = defineEmits(['decoded'])

const { stream, state, start } = useCamera()
const { decode, method } = useQrDecoder()
const video = ref(null)
let raf = null
let lastScan = 0

async function step(ts) {
  raf = requestAnimationFrame(step)
  if (props.paused || state.value !== 'active' || !video.value) return
  if (ts - lastScan < 125) return
  lastScan = ts
  try {
    const code = await decode(video.value)
    if (code) emit('decoded', code)
  } catch {
    /* frame gagal, abaikan */
  }
}

watch(state, async (s) => {
  if (s === 'active') {
    await nextTick()
    if (video.value && stream.value) video.value.srcObject = stream.value
    if (!raf) raf = requestAnimationFrame(step)
  }
})

onMounted(() => {
  raf = requestAnimationFrame(step)
})
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <div>
    <div
      class="relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-lg border border-line bg-surface"
    >
      <video
        v-show="state === 'active'"
        ref="video"
        class="h-full w-full object-cover"
        playsinline
        muted
        aria-label="Pratinjau kamera"
      />

      <div v-if="state === 'active'" class="pointer-events-none absolute inset-0 grid place-items-center">
        <div class="relative h-1/2 w-1/2" :class="paused ? 'text-red-600' : 'text-white'" aria-hidden="true">
          <span class="absolute -top-px -left-px h-7 w-7 rounded-tl border-t-[3px] border-l-[3px] border-current" />
          <span class="absolute -top-px -right-px h-7 w-7 rounded-tr border-t-[3px] border-r-[3px] border-current" />
          <span class="absolute -bottom-px -left-px h-7 w-7 rounded-bl border-b-[3px] border-l-[3px] border-current" />
          <span class="absolute -right-px -bottom-px h-7 w-7 rounded-br border-r-[3px] border-b-[3px] border-current" />
        </div>
      </div>

      <div v-if="state !== 'active'" class="max-w-sm px-6 text-center">
        <Camera v-if="state === 'idle'" :size="40" class="mx-auto text-ink-400" />
        <ScanLine v-else :size="40" class="mx-auto text-ink-400" />

        <p v-if="state === 'idle'" class="mt-3 text-sm text-ink-500">
          Aktifkan kamera untuk memindai QR mahasiswa.
        </p>
        <p v-else-if="state === 'requesting'" class="mt-3 text-sm text-ink-500">
          Izinkan akses kamera pada dialog browser.
        </p>
        <p v-else-if="state === 'denied'" class="mt-3 text-sm text-ink-700">
          Akses kamera diblokir. Buka pengaturan situs di browser, izinkan kamera, lalu muat ulang halaman.
        </p>
        <p v-else-if="state === 'none'" class="mt-3 text-sm text-ink-700">
          Kamera tidak ditemukan. Hubungkan webcam atau masukkan kode secara manual.
        </p>
        <p v-else class="mt-3 text-sm text-ink-700">
          Kamera tidak dapat diaktifkan. Masukkan kode secara manual.
        </p>

        <button
          type="button"
          class="mt-3 h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
          @click="start"
        >
          {{ state === 'idle' ? 'Aktifkan kamera' : 'Coba lagi' }}
        </button>
      </div>

      <p
        v-if="paused && state === 'active'"
        class="absolute bottom-3 rounded-md bg-red-600 px-3 py-1 text-[13px] font-medium text-white"
      >
        Memeriksa QR...
      </p>
    </div>

    <p class="mt-2 text-[12px] text-ink-500">
      Deteksi: {{ method }}. Kamera mati otomatis saat tab tidak terlihat.
    </p>
  </div>
</template>
