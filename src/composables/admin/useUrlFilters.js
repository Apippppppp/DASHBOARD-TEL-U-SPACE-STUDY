import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Sinkronkan objek filter dengan query string.
 * @param {Record<string,string>} defaults nilai default per kunci (tidak ditulis ke URL)
 */
export function useUrlFilters(defaults = {}) {
  const route = useRoute()
  const router = useRouter()

  const filters = reactive({ ...defaults })
  for (const key of Object.keys(defaults)) {
    const q = route.query[key]
    if (typeof q === 'string' && q !== '') filters[key] = q
  }

  let syncing = false
  watch(
    filters,
    () => {
      if (syncing) return
      const query = { ...route.query }
      for (const key of Object.keys(defaults)) {
        const value = filters[key]
        if (value == null || value === '' || value === defaults[key]) delete query[key]
        else query[key] = String(value)
      }
      syncing = true
      router.replace({ query }).finally(() => {
        syncing = false
      })
    },
    { deep: true }
  )

  function reset() {
    for (const key of Object.keys(defaults)) filters[key] = defaults[key]
  }

  return { filters, reset }
}
