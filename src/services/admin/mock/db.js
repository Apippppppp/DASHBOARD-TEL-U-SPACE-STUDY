import { buildReservations } from '@/data/admin/adminReservations'
import { buildAccessLogs } from '@/data/admin/accessLogs'
import { ADMIN_ROOMS } from '@/data/admin/rooms'
import { STAFF_ACCOUNTS } from '@/data/admin/staffAccounts'

export const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms))

// Database mock di memori, sekali inisialisasi. Status "hari ini" relatif terhadap waktu muat halaman.
export const db = {
  reservations: buildReservations(),
  accessLogs: buildAccessLogs(),
  rooms: ADMIN_ROOMS.map((r) => ({ ...r })),
  accounts: STAFF_ACCOUNTS.map((a) => ({ ...a }))
}

export const findReservation = (code) => db.reservations.find((r) => r.code === code)
