import { defineStore } from 'pinia'

const KEY = 'petugas.auth'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } catch {
    return null
  }
}

export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({ user: load() }),
  getters: {
    isAuthenticated: (s) => !!s.user,
    role: (s) => s.user?.role ?? null,
    isAdmin: (s) => s.user?.role === 'admin',
    displayName: (s) => s.user?.name ?? ''
  },
  actions: {
    login({ role, name, email }) {
      this.user = {
        role,
        name: name || (role === 'admin' ? 'Rani Kusuma' : 'Sari Melati'),
        email: email || `${role}@telkomuniversity.ac.id`
      }
      localStorage.setItem(KEY, JSON.stringify(this.user))
    },
    logout() {
      this.user = null
      localStorage.removeItem(KEY)
    }
  }
})
