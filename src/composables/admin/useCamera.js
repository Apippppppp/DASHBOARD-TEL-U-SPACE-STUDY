import { ref, onUnmounted } from 'vue'

// State: idle | requesting | active | denied | none | error
export function useCamera() {
  const stream = ref(null)
  const state = ref('idle')
  const error = ref(null)

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      state.value = 'none'
      return
    }
    state.value = 'requesting'
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
        audio: false
      })
      state.value = 'active'
    } catch (e) {
      error.value = e
      state.value = e?.name === 'NotAllowedError' ? 'denied' : e?.name === 'NotFoundError' ? 'none' : 'error'
    }
  }

  function stop() {
    stream.value?.getTracks().forEach((t) => t.stop())
    stream.value = null
    if (state.value === 'active') state.value = 'idle'
  }

  function handleVisibility() {
    if (document.hidden) stop()
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibility)
  }

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibility)
    stop()
  })

  return { stream, state, error, start, stop }
}
