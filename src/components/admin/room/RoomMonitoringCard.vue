<script setup>
import { computed } from 'vue'
import { useDeviceFreshness } from '@/composables/admin/useDeviceFreshness'
import SparklineChart from './SparklineChart.vue'
import DeviceStatusBadge from './DeviceStatusBadge.vue'
import { TEMP_COMFORT, HUMIDITY_COMFORT } from '@/config/monitoring'
import { ageLabel, decimalId, fmtTime } from '@/utils/format'

const props = defineProps({
  room: { type: Object, required: true },
  sensor: { type: Object, default: null }, // { latest, receivedAt, history, lastMotionAt }
  bridgeConnected: { type: Boolean, default: true },
  usage: { type: String, default: 'Kosong' },
  full: { type: Boolean, default: false }
})
defineEmits(['open'])

const receivedAt = computed(() => props.sensor?.receivedAt || 0)
const { ageMs, state } = useDeviceFreshness(receivedAt)

const connected = computed(() => props.room.deviceId && props.sensor)
const showNumbers = computed(
  () => connected.value && props.bridgeConnected && (state.value === 'ok' || state.value === 'stale')
)

const temp = computed(() => props.sensor?.latest?.temperature ?? null)
const humidity = computed(() => props.sensor?.latest?.humidity ?? null)
const door = computed(() => props.sensor?.latest?.door ?? 'UNKNOWN')

const doorLabel = computed(() => {
  const d = door.value
  if (d === 'LOCKED') return 'Terkunci'
  if (d === 'OPEN' || d === 'UNLOCKED') return 'Terbuka'
  return `Tidak diketahui (${d})`
})

const tempOut = computed(
  () => temp.value != null && (temp.value < TEMP_COMFORT.min || temp.value > TEMP_COMFORT.max)
)
const humidityOut = computed(
  () => humidity.value != null && (humidity.value < HUMIDITY_COMFORT.min || humidity.value > HUMIDITY_COMFORT.max)
)

const tempHistory = computed(() => (props.sensor?.history ?? []).map((h) => h.temperature))
const humidityHistory = computed(() => (props.sensor?.history ?? []).map((h) => h.humidity))

const motionText = computed(() => {
  if (!props.sensor) return 'Tidak ada gerakan'
  if (props.sensor.latest?.motion) return 'Gerakan terdeteksi'
  if (!props.sensor.lastMotionAt) return 'Belum terdeteksi sejak halaman dibuka'
  return `Tidak ada gerakan · terakhir ${ageLabel(Date.now() - props.sensor.lastMotionAt)}`
})

const lastKnown = computed(() => props.sensor?.latest)
const ageText = computed(() => (ageMs.value ? ageLabel(ageMs.value) : ''))
const receivedFull = computed(() => (receivedAt.value ? fmtTime(receivedAt.value) : ''))
</script>

<template>
  <button
    type="button"
    class="w-full rounded-lg border border-line bg-white p-4 text-left transition-colors hover:border-red-100"
    @click="$emit('open', room)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="truncate font-display text-base font-semibold text-ink-900">{{ room.name }}</p>
        <p class="text-[13px] text-ink-500">{{ room.building }}, Lantai {{ room.floor }}</p>
      </div>
      <span
        class="shrink-0 rounded-sm px-2 py-1 text-[12px] font-medium"
        :class="usage === 'Digunakan' ? 'bg-red-50 text-red-700' : 'bg-surface text-ink-700'"
      >
        {{ usage }}
      </span>
    </div>

    <!-- Tanpa perangkat -->
    <p v-if="!connected" class="mt-4 rounded-md bg-surface px-3 py-4 text-center text-[13px] text-ink-500">
      Perangkat belum terpasang
    </p>

    <template v-else>
      <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-3">
        <div>
          <dt class="text-[12px] text-ink-500">Suhu</dt>
          <dd
            class="tnum text-[15px] font-medium"
            :class="state === 'stale' ? 'text-ink-500' : 'text-ink-900'"
          >
            <template v-if="showNumbers">{{ decimalId(temp) }} °C</template>
            <template v-else>—</template>
          </dd>
          <p v-if="showNumbers && tempOut" class="text-[11px] text-busy-600">Di luar rentang nyaman</p>
          <p v-else-if="state === 'stale'" class="text-[11px] text-ink-500">Data tertunda</p>
          <p v-else-if="!bridgeConnected" class="text-[11px] text-ink-500">Server terputus</p>
          <p v-else-if="lastKnown && lastKnown.temperature != null" class="text-[11px] text-ink-400">
            Terakhir {{ decimalId(lastKnown.temperature) }} °C pada {{ receivedFull }}
          </p>
          <SparklineChart v-if="full && showNumbers" class="mt-1" :values="tempHistory" />
        </div>
        <div>
          <dt class="text-[12px] text-ink-500">Kelembapan</dt>
          <dd
            class="tnum text-[15px] font-medium"
            :class="state === 'stale' ? 'text-ink-500' : 'text-ink-900'"
          >
            <template v-if="showNumbers">{{ Math.round(humidity) }} %</template>
            <template v-else>—</template>
          </dd>
          <p v-if="showNumbers && humidityOut" class="text-[11px] text-busy-600">Di luar rentang nyaman</p>
          <p v-else-if="state === 'stale'" class="text-[11px] text-ink-500">Data tertunda</p>
          <p v-else-if="lastKnown && lastKnown.humidity != null" class="text-[11px] text-ink-400">
            Terakhir {{ Math.round(lastKnown.humidity) }} % pada {{ receivedFull }}
          </p>
          <SparklineChart v-if="full && showNumbers" class="mt-1" :values="humidityHistory" :color="'#2F7D5B'" />
        </div>
        <div>
          <dt class="text-[12px] text-ink-500">Gerakan</dt>
          <dd class="text-[13px] text-ink-900">{{ showNumbers ? motionText : '—' }}</dd>
        </div>
        <div>
          <dt class="text-[12px] text-ink-500">Pintu</dt>
          <dd class="text-[13px] text-ink-900">{{ showNumbers ? doorLabel : '—' }}</dd>
        </div>
      </dl>

      <div class="mt-3 flex items-center justify-between border-t border-line pt-3">
        <DeviceStatusBadge
          :device="!!room.deviceId"
          :bridge-connected="bridgeConnected"
          :freshness="state"
        />
        <span v-if="showNumbers" class="text-[12px] text-ink-500" :title="receivedFull">
          Data {{ ageText }}
        </span>
      </div>
    </template>
  </button>
</template>
