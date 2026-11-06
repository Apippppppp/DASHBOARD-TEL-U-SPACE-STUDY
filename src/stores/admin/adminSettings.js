import { defineStore } from 'pinia'
import * as roomService from '@/services/admin/adminRoomService'
import * as accountService from '@/services/admin/adminAccountService'

export const useAdminSettingsStore = defineStore('adminSettings', {
  state: () => ({ rooms: [], accounts: [], loading: false, error: null }),
  actions: {
    async fetchRooms() {
      this.loading = true
      try {
        this.rooms = await roomService.listRooms()
      } catch (e) {
        this.error = e?.message
      } finally {
        this.loading = false
      }
    },
    async fetchAccounts() {
      this.loading = true
      try {
        this.accounts = await accountService.listAccounts()
      } catch (e) {
        this.error = e?.message
      } finally {
        this.loading = false
      }
    },
    async saveRoom(room) {
      const saved = await roomService.saveRoom(room)
      const i = this.rooms.findIndex((r) => r.id === saved.id)
      if (i !== -1) this.rooms[i] = saved
      else this.rooms.push(saved)
      return saved
    },
    async setRoomActive(id, active) {
      const saved = await roomService.setRoomActive(id, active)
      const i = this.rooms.findIndex((r) => r.id === id)
      if (i !== -1) this.rooms[i] = saved
    },
    async saveAccount(account) {
      const saved = await accountService.saveAccount(account)
      const i = this.accounts.findIndex((a) => a.id === saved.id)
      if (i !== -1) this.accounts[i] = saved
      else this.accounts.push(saved)
      return saved
    },
    async setAccountActive(id, active) {
      const saved = await accountService.setAccountActive(id, active)
      const i = this.accounts.findIndex((a) => a.id === id)
      if (i !== -1) this.accounts[i] = saved
    },
    resetPassword(id) {
      return accountService.resetPassword(id)
    }
  }
})
