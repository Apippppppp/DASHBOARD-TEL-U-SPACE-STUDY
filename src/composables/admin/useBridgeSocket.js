import { ref } from 'vue'
import { io } from 'socket.io-client'
import { BRIDGE_URL } from '@/services/admin/http'
import { useSensorsStore } from '@/stores/admin/sensors'

// Singleton: satu koneksi dibagi seluruh layout (design-admin 10.4).
const status = ref('idle') // idle | connected | reconnecting | disconnected
let socket = null
let started = false
let sensors = null

export function useBridgeSocket() {
  sensors = sensors || useSensorsStore()

  function start() {
    if (started) return
    started = true
    socket = io(BRIDGE_URL, { reconnection: true })
    socket.on('connect', () => {
      status.value = 'connected'
      sensors.setBridgeConnected(true)
    })
    socket.on('disconnect', () => {
      status.value = 'disconnected'
      sensors.setBridgeConnected(false)
    })
    socket.on('connect_error', () => {
      status.value = 'disconnected'
      sensors.setBridgeConnected(false)
    })
    socket.io.on('reconnect_attempt', () => {
      status.value = 'reconnecting'
    })
    // Nama event sebenarnya dari Bridge (studyspace-bridge/server.js).
    socket.on('sensor-data', (payload) => sensors.ingest(payload))
  }

  function stop() {
    if (!started) return
    started = false
    socket?.disconnect()
    socket = null
    status.value = 'idle'
    sensors.setBridgeConnected(false)
  }

  return { status, start, stop }
}
