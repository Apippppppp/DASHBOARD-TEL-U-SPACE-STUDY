import { ADMIN_STUDENTS } from './students'
import { ADMIN_ROOMS } from './rooms'

const METHODS = ['QR kamera', 'Kode manual']
const DENY_REASONS = [
  'QR tidak dikenal.',
  'Reservasi sudah dibatalkan.',
  'Check-in sudah tercatat untuk reservasi ini.',
  'QR sudah kedaluwarsa.'
]

// 44 catatan akses, campuran berhasil dan ditolak, tersebar 3 hari terakhir.
export function buildAccessLogs(now = new Date()) {
  const rows = []
  for (let i = 0; i < 44; i++) {
    const denied = i % 4 === 0
    const minutesAgo = i * 47 + (i % 7) * 9
    const at = new Date(now.getTime() - minutesAgo * 60000)
    const student = denied && i % 8 === 0 ? null : ADMIN_STUDENTS[i % ADMIN_STUDENTS.length]
    const room = ADMIN_ROOMS[i % ADMIN_ROOMS.length]
    rows.push({
      id: `log-${i}`,
      at: at.toISOString(),
      studentId: student?.id ?? null,
      studentName: student?.name ?? 'Tidak dikenal',
      nim: student?.nim ?? null,
      roomId: student ? room.id : null,
      roomName: student ? room.name : '—',
      method: METHODS[i % 2],
      result: denied ? 'denied' : 'ok',
      reason: denied ? DENY_REASONS[i % DENY_REASONS.length] : '',
      code: student ? `SS-2611-${String.fromCharCode(65 + (i % 26))}${(i % 9) + 1}Q${(i % 5) + 1}` : null
    })
  }
  return rows
}

export const ACCESS_DENY_REASONS = DENY_REASONS
