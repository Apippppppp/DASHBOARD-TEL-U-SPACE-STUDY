import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({ items: [] }),
  actions: {
    push(message, variant = 'ok') {
      const id = `${Date.now()}-${Math.round(Math.random() * 1e5)}`
      this.items.push({ id, message, variant })
      setTimeout(() => this.dismiss(id), 4000)
    },
    dismiss(id) {
      this.items = this.items.filter((t) => t.id !== id)
    }
  }
})
