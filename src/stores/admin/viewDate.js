import { defineStore } from 'pinia'

export const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Tanggal yang sedang dilihat petugas di dashboard (design-admin 4.3).
export const useViewDateStore = defineStore('viewDate', {
  state: () => ({ date: todayISO() }),
  getters: {
    isToday: (s) => s.date === todayISO(),
    asDate: (s) => new Date(`${s.date}T00:00:00`)
  },
  actions: {
    setDate(value) {
      if (value) this.date = value
    },
    reset() {
      this.date = todayISO()
    }
  }
})
