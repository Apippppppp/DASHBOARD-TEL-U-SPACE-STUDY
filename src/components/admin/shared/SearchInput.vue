<script setup>
import { ref, watch } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Cari...' }
})
const emit = defineEmits(['update:modelValue'])

const local = ref(props.modelValue)
let timer = null

watch(
  () => props.modelValue,
  (v) => {
    if (v !== local.value) local.value = v
  }
)

watch(local, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => emit('update:modelValue', v), 250)
})

function onKeydown(e) {
  if (e.key === 'Escape') {
    local.value = ''
    clearTimeout(timer)
    emit('update:modelValue', '')
  }
}
</script>

<template>
  <div class="relative">
    <Search :size="18" class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-400" />
    <input
      v-model="local"
      type="search"
      :placeholder="placeholder"
      class="h-10 w-full rounded-md border border-line bg-white pr-3 pl-10 text-sm text-ink-900 placeholder:text-ink-400 focus:border-red-600 focus:outline-none"
      @keydown="onKeydown"
    />
  </div>
</template>
