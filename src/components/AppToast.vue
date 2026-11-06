<script setup>
import { useToastStore } from '@/stores/toast'
import { CheckCircle2, XCircle } from 'lucide-vue-next'

const toasts = useToastStore()
</script>

<template>
  <div class="pointer-events-none fixed top-4 right-4 z-[100] flex w-80 flex-col gap-2">
    <div
      v-for="t in toasts.items"
      :key="t.id"
      class="pointer-events-auto flex items-start gap-3 rounded-lg border border-line bg-white px-4 py-3 shadow-float"
    >
      <CheckCircle2 v-if="t.variant !== 'error'" :size="18" class="mt-0.5 shrink-0 text-free-600" />
      <XCircle v-else :size="18" class="mt-0.5 shrink-0 text-red-600" />
      <p class="text-sm text-ink-900">{{ t.message }}</p>
    </div>
  </div>
</template>
