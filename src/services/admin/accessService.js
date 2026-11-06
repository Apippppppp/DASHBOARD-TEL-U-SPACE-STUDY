import { USE_MOCK, http } from './http'
import { db, delay } from './mock/db'
import { getAdminRoomById } from '@/data/admin/rooms'
import { getStudentById } from '@/data/admin/students'

// Kode QR mock untuk simulasi (design-admin 8.4). Tidak dirender di produksi.
export const MOCK_QR_TOKENS = {
  valid: 'SS-VALID-ADITYA',
  cancelled: 'SS-CANCELLED-ADITYA',
  notStarted: 'SS-NOTSTARTED-ADITYA',
  ended: 'SS-ENDED-ADITYA',
  unknown: 'SS-UNKNOWN-XXXX',
  error: 'SS-ERROR-SERVER'
}

function bookingInfo(r) {
  const room = getAdminRoomById(r.roomId)
  return {
    code: r.code,
    roomId: r.roomId,
    roomName: room?.name ?? '—',
    location: room ? `${room.building}, Lantai ${room.floor}` : '—',
    start: r.start,
    end: r.end
  }
}

function studentInfo(id) {
  const s = getStudentById(id)
  if (!s) return undefined
  return { id: s.id, name: s.name, nim: s.nim, email: s.email, prodi: s.prodi }
}

function logAccess({ source, result, reason, booking, student }) {
  db.accessLogs.unshift({
    id: `log-${Date.now()}-${Math.round(Math.random() * 1e4)}`,
    at: new Date().toISOString(),
    studentId: student?.id ?? null,
    studentName: student?.name ?? 'Tidak dikenal',
    nim: student?.nim ?? null,
    roomId: booking?.roomId ?? null,
    roomName: booking?.roomName ?? '—',
    method: source === 'manual' ? 'Kode manual' : 'QR kamera',
    result,
    reason: reason ?? '',
    code: booking?.code ?? null
  })
}

async function mockValidate(payload, source) {
  await delay(320)
  const token = String(payload || '').trim().toUpperCase()
  if (token === MOCK_QR_TOKENS.error) {
    throw new Error('Mock: server tidak merespons')
  }
  const demo = db.reservations[0]
  const booking = bookingInfo(demo)
  const student = studentInfo(demo.studentId)

  if (token === MOCK_QR_TOKENS.valid) {
    logAccess({ source, result: 'ok', booking, student })
    return { status: 'valid', booking, student, checkedInAt: new Date().toISOString() }
  }
  if (token === MOCK_QR_TOKENS.cancelled) {
    logAccess({ source, result: 'denied', reason: 'Reservasi sudah dibatalkan.', booking, student })
    return { status: 'denied', reason: 'cancelled', booking, student }
  }
  if (token === MOCK_QR_TOKENS.notStarted) {
    logAccess({ source, result: 'denied', reason: 'Reservasi belum dimulai.', booking, student })
    return { status: 'not_started', booking, student, activeFrom: booking.start }
  }
  if (token === MOCK_QR_TOKENS.ended) {
    logAccess({ source, result: 'denied', reason: 'Reservasi sudah berakhir.', booking, student })
    return { status: 'ended', booking, student, endedAt: booking.end }
  }
  logAccess({ source, result: 'denied', reason: 'QR tidak dikenal.' })
  return { status: 'denied', reason: 'unknown_qr' }
}

/**
 * Kirim isi QR apa adanya ke backend. Frontend tidak menyimpulkan akses.
 * @param {string} payload isi mentah dari QR atau kode manual
 * @param {'camera'|'manual'} source
 */
export async function validateQr(payload, source) {
  if (USE_MOCK) return mockValidate(payload, source)
  const { data } = await http.post('/access/validate', { payload, source })
  return data
}
