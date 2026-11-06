<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: Number, default: 480 }
})
const emit = defineEmits(['close'])
const panel = ref(null)
let lastActive = null

function focusables() {
  return panel.value?.querySelectorAll(
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
  )
}

function onKey(e) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (e.key !== 'Tab') return
  const list = focusables()
  if (!list || !list.length) return
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

watch(
  () => props.open,
  async (open) => {
    if (open) {
      lastActive = document.activeElement
      document.addEventListener('keydown', onKey)
      await nextTick()
      ;(panel.value?.querySelector('[data-autofocus]') || panel.value)?.focus()
    } else {
      document.removeEventListener('keydown', onKey)
      lastActive?.focus?.()
    }
  }
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-ink-900/40" @click="emit('close')" />
        <div
          ref="panel"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          class="absolute top-0 right-0 h-full w-full overflow-y-auto rounded-l-xl bg-white shadow-float outline-none"
          :style="{ maxWidth: `${width}px` }"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 200ms var(--ease-out);
}
.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 240ms var(--ease-out);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
