// Ambang kesegaran data sensor (design-admin 10.3). Ubah sesuai interval publish ESP32.
export const STALE_AFTER_MS = 10_000
export const OFFLINE_AFTER_MS = 30_000

// Rentang nyaman (dapat diubah)
export const TEMP_COMFORT = { min: 22, max: 28 }
export const HUMIDITY_COMFORT = { min: 40, max: 70 }

// Jendela sparkline (10.2)
export const HISTORY_MAX_POINTS = 60
