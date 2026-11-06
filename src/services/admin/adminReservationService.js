import { USE_MOCK, http } from './http'
import { db, delay, findReservation } from './mock/db'

export async function listReservations() {
  if (USE_MOCK) {
    await delay()
    return db.reservations.map((r) => ({ ...r }))
  }
  const { data } = await http.get('/reservations')
  return data
}

// Check-in manual (jaga-jaga bila scan QR bermasalah).
export async function checkInReservation(code) {
  if (USE_MOCK) {
    await delay()
    const r = findReservation(code)
    if (!r) throw new Error('Reservasi tidak ditemukan')
    r.status = 'active'
    r.statusHistory = [...r.statusHistory, { label: 'Check-in (manual)', at: new Date().toISOString() }]
    return { ...r }
  }
  const { data } = await http.post(`/reservations/${code}/check-in`)
  return data
}

// Check-out manual.
export async function checkOutReservation(code) {
  if (USE_MOCK) {
    await delay()
    const r = findReservation(code)
    if (!r) throw new Error('Reservasi tidak ditemukan')
    r.status = 'done'
    r.statusHistory = [...r.statusHistory, { label: 'Check-out (manual)', at: new Date().toISOString() }]
    return { ...r }
  }
  const { data } = await http.post(`/reservations/${code}/check-out`)
  return data
}

export async function cancelReservation(code, reason = 'Dibatalkan petugas') {
  if (USE_MOCK) {
    await delay()
    const r = findReservation(code)
    if (!r) throw new Error('Reservasi tidak ditemukan')
    r.status = 'cancelled'
    r.cancelReason = reason
    r.statusHistory = [
      ...r.statusHistory,
      { label: reason, at: new Date().toISOString() }
    ]
    return { ...r }
  }
  const { data } = await http.post(`/reservations/${code}/cancel`, { reason })
  return data
}
