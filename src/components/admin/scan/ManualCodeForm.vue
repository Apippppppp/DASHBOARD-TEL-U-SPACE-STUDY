<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])
const code = ref('')

function submit() {
  const value = code.value.trim()
  if (!value) return
  emit('submit', value)
  code.value = ''
}
</script>

<template>
  <form class="mt-3" @submit.prevent="submit">
    <label for="manual-code" class="text-[13px] font-medium text-ink-700">
      Atau masukkan kode manual
    </label>
    <div class="mt-2 flex gap-2">
      <input
        id="manual-code"
        v-model="code"
        type="text"
        placeholder="Kode booking atau token"
        class="tnum h-10 flex-1 rounded-md border border-line bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-red-600 focus:outline-none"
      />
      <button
        type="submit"
        class="h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
      >
        Periksa
      </button>
    </div>
  </form>
</template>
