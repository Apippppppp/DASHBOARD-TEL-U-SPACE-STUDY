<script setup>
import { computed } from 'vue'

const props = defineProps({
  values: { type: Array, default: () => [] },
  width: { type: Number, default: 120 },
  height: { type: Number, default: 32 },
  color: { type: String, default: '#9f1521' }
})

const numeric = computed(() => props.values.filter((n) => typeof n === 'number' && isFinite(n)))

const path = computed(() => {
  const v = numeric.value
  if (v.length < 2) return ''
  const min = Math.min(...v)
  const max = Math.max(...v)
  const span = max - min || 1
  const stepX = props.width / (v.length - 1)
  return v
    .map((n, i) => {
      const x = i * stepX
      const y = props.height - ((n - min) / span) * props.height
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
})
</script>

<template>
  <svg
    v-if="numeric.length >= 2"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      :d="path"
      fill="none"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  <p v-else class="text-[11px] text-ink-400">Mengumpulkan data...</p>
</template>
