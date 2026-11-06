import axios from 'axios'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
export const BRIDGE_URL = import.meta.env.VITE_BRIDGE_URL || 'http://localhost:3000'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 8000,
  headers: { Accept: 'application/json' }
})
