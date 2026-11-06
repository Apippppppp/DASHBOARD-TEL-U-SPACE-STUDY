<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Lanjutkan' },
  cancelLabel: { type: String, default: 'Kembali' },
  danger: { type: Boolean, default: false },
  busy: { type: Boolean, default: false }
})
const emit = defineEmits(['confirm', 'cancel'])
const panel = ref(null)

function onKey(e) {
  if (e.key === 'Escape') emit('cancel')
  if (e.key === 'Tab' && panel.value) {
    const list = panel.value.querySelectorAll('button:not([disabled])')
    if (!list.length) return
    const first = list[0]
    const last = list[list.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      document.addEventListener('keydown', onKey)
      await nextTick()
      panel.value?.querySelector('[data-autofocus]')?.focus()
    } else {
      document.removeEventListener('keydown', onKey)
    }
  }
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="open" class="fixed inset-0 z-[60] grid place-items-center p-4">
        <div class="absolute inset-0 bg-ink-900/40" @click="emit('cancel')" />
        <div
          ref="panel"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          class="relative w-full max-w-[420px] rounded-xl bg-white p-6 shadow-float"
        >
          <h2 id="confirm-title" class="font-display text-lg font-semibold">{{ title }}</h2>
          <p v-if="message" class="mt-2 text-sm text-ink-700">{{ message }}</p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="h-10 rounded-md border border-line px-4 text-sm font-medium text-ink-700 hover:bg-surface"
              @click="emit('cancel')"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              data-autofocus
              :disabled="busy"
              class="h-10 rounded-md px-4 text-sm font-medium text-white disabled:opacity-60"
              :class="danger ? 'bg-red-600 hover:bg-red-600/90' : 'bg-red-600 hover:bg-red-700'"
              @click="emit('confirm')"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 200ms var(--ease-out);
}
.dialog-enter-active > div:last-child,
.dialog-leave-active > div:last-child {
  transition: transform 200ms var(--ease-out);
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-from > div:last-child {
  transform: translateY(8px);
}
</style>
