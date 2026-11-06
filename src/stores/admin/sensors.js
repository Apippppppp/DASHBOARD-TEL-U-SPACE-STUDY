import { defineStore } from 'pinia'
import { HISTORY_MAX_POINTS } from '@/config/monitoring'

const numOrNull = (v) => (typeof v === 'number' && isFinite(v) ? v : null)

export const useSensorsStore = defineStore('adminSensors', {
  state: () => ({
    bridgeConnected: false,
    // deviceId -> { latest, receivedAt, history[], lastMotionAt }
    devices: {}
  }),
  actions: {
    setBridgeConnected(v) {
      this.bridgeConnected = v
    },
    ingest(payload) {
      const topic = payload?.topic || ''
      const data = payload?.data
      if (typeof data !== 'object' || data === null) {
        console.warn('Paket sensor tidak valid (bukan objek):', payload)
        return
      }
      // topic "studyspace/room/A/sensors" -> deviceId "A"
      const deviceId = topic.split('/')[2]
      if (!deviceId) {
        console.warn('Paket sensor tanpa deviceId yang bisa diturunkan:', topic)
        return
      }
      const device =
        this.devices[deviceId] ||
        (this.devices[deviceId] = { latest: null, receivedAt: 0, history: [], lastMotionAt: null })

      device.latest = {
        temperature: numOrNull(data.temperature),
        humidity: numOrNull(data.humidity),
        motion: !!data.motion,
        door: typeof data.door === 'string' ? data.door : 'UNKNOWN'
      }
      device.receivedAt = Date.now()
      if (device.latest.temperature != null && device.latest.humidity != null) {
        device.history.push({
          at: device.receivedAt,
          temperature: device.latest.temperature,
          humidity: device.latest.humidity
        })
        if (device.history.length > HISTORY_MAX_POINTS) device.history.shift()
      }
      if (device.latest.motion) device.lastMotionAt = device.receivedAt
    }
  }
})
