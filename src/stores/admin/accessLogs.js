import { defineStore } from 'pinia'
import { listAccessLogs } from '@/services/admin/accessLogService'

export const useAccessLogsStore = defineStore('accessLogs', {
  state: () => ({ rows: [], loading: false, error: null }),
  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        this.rows = await listAccessLogs()
      } catch (e) {
        this.error = e?.message || 'Gagal memuat'
      } finally {
        this.loading = false
      }
    }
  }
})
