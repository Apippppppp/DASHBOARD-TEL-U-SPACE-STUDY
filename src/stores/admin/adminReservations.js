import { defineStore } from 'pinia'
import {
  listReservations,
  cancelReservation,
  checkInReservation,
  checkOutReservation
} from '@/services/admin/adminReservationService'
import { getStudentById } from '@/data/admin/students'
import { getAdminRoomById } from '@/data/admin/rooms'

export const useAdminReservationsStore = defineStore('adminReservations', {
  state: () => ({ rows: [], loading: false, error: null }),
  getters: {
    enriched: (s) =>
      s.rows.map((r) => ({
        ...r,
        student: getStudentById(r.studentId),
        room: getAdminRoomById(r.roomId)
      }))
  },
  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        this.rows = await listReservations()
      } catch (e) {
        this.error = e?.message || 'Gagal memuat'
      } finally {
        this.loading = false
      }
    },
    async cancel(code, reason) {
      const updated = await cancelReservation(code, reason)
      this._replace(code, updated)
      return updated
    },
    async checkIn(code) {
      const updated = await checkInReservation(code)
      this._replace(code, updated)
      return updated
    },
    async checkOut(code) {
      const updated = await checkOutReservation(code)
      this._replace(code, updated)
      return updated
    },
    _replace(code, updated) {
      const i = this.rows.findIndex((r) => r.code === code)
      if (i !== -1) this.rows[i] = updated
    }
  }
})
