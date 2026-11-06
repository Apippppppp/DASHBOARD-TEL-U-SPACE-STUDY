import { ADMIN_STUDENTS } from './students'
import { ADMIN_ROOMS } from './rooms'

const CODE = (i) => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const a = letters[i % letters.length]
  const b = letters[(i * 5 + 3) % letters.length]
  const n = String((i * 37 + 11) % 90 + 10)
  return `SS-2611-${a}${n}Q${b}`
}

// Konfigurasi reservasi. `start`/`end` = offset menit dari sekarang (hari ini).
// `day` + `sh`/`eh` = hari relatif dan jam untuk hari lain.
const RAW = [
  { s: 'active', start: -45, end: 75, room: 0, student: 0, purpose: 'Diskusi kelompok Tugas Besar', p: 5, checked: true },
  { s: 'active', start: -30, end: 90, room: 6, student: 3, purpose: 'Workshop UX', p: 10, checked: true },
  { s: 'active', start: -80, end: 40, room: 4, student: 5, purpose: 'Meeting divisi', p: 6, checked: true },
  { s: 'waiting', start: 25, end: 145, room: 1, student: 1, purpose: 'Belajar bersama', p: 4 },
  { s: 'waiting', start: -18, end: 102, room: 2, student: 2, purpose: 'Tutorial mata kuliah', p: 3 },
  { s: 'waiting', start: 40, end: 160, room: 3, student: 7, purpose: 'Review jurnal', p: 2 },
  { s: 'done', start: -200, end: -80, room: 0, student: 8, purpose: 'Latihan presentasi', p: 4, checked: true },
  { s: 'done', start: -240, end: -120, room: 5, student: 9, purpose: 'Rapat panitia', p: 8, checked: true },
  { s: 'done', start: -300, end: -180, room: 2, student: 11, purpose: 'Belajar mandiri', p: 1, checked: true },
  { s: 'cancelled', start: 90, end: 210, room: 7, student: 10, purpose: 'Sesi mentoring', p: 2, cancelReason: 'Dibatalkan mahasiswa' },
  { s: 'cancelled', start: -60, end: 60, room: 1, student: 12, purpose: 'Diskusi proyek', p: 4, cancelReason: 'Dibatalkan petugas' },
  { s: 'cancelled', start: -150, end: -30, room: 3, student: 13, purpose: 'Belajar kelompok', p: 2, cancelReason: 'Tidak check-in dalam 15 menit' },
  { s: 'waiting', day: 1, sh: 8, eh: 10, room: 0, student: 1, purpose: 'Diskusi kelompok', p: 5 },
  { s: 'waiting', day: 1, sh: 10, eh: 12, room: 4, student: 4, purpose: 'Presentasi proyek', p: 9 },
  { s: 'waiting', day: 1, sh: 13, eh: 15, room: 2, student: 6, purpose: 'Tutorial', p: 3 },
  { s: 'waiting', day: 2, sh: 9, eh: 11, room: 1, student: 8, purpose: 'Belajar bersama', p: 4 },
  { s: 'waiting', day: 2, sh: 14, eh: 16, room: 5, student: 3, purpose: 'Rapat organisasi', p: 8 },
  { s: 'waiting', day: 5, sh: 10, eh: 12, room: 6, student: 2, purpose: 'Hackathon prep', p: 12 },
  { s: 'waiting', day: 6, sh: 13, eh: 15, room: 4, student: 9, purpose: 'Coaching', p: 6 },
  { s: 'done', day: -1, sh: 9, eh: 11, room: 0, student: 5, purpose: 'Diskusi kelompok', p: 4, checked: true },
  { s: 'done', day: -1, sh: 13, eh: 15, room: 3, student: 7, purpose: 'Belajar mandiri', p: 2, checked: true },
  { s: 'done', day: -2, sh: 10, eh: 12, room: 6, student: 10, purpose: 'Workshop data', p: 11, checked: true },
  { s: 'cancelled', day: -1, sh: 15, eh: 17, room: 2, student: 11, purpose: 'Sesi tutor', p: 3, cancelReason: 'Dibatalkan mahasiswa' },
  { s: 'done', day: -3, sh: 8, eh: 10, room: 1, student: 12, purpose: 'Latihan soal', p: 4, checked: true },
  { s: 'waiting', day: 3, sh: 11, eh: 13, room: 7, student: 13, purpose: 'Belajar mandiri', p: 1 },
  { s: 'done', day: -4, sh: 14, eh: 16, room: 4, student: 0, purpose: 'Rapat divisi', p: 7, checked: true }
]

function buildOne(now, i) {
  const e = RAW[i]
  let start
  let end
  if (e.day != null) {
    const base = new Date(now)
    base.setDate(base.getDate() + e.day)
    start = new Date(base)
    start.setHours(e.sh, 0, 0, 0)
    end = new Date(base)
    end.setHours(e.eh, 0, 0, 0)
  } else {
    start = new Date(now.getTime() + e.start * 60000)
    end = new Date(now.getTime() + e.end * 60000)
  }
  const createdAt = new Date(start.getTime() - (20 + i) * 3600 * 1000)
  const history = [{ label: 'Dibuat', at: createdAt.toISOString() }]
  if (e.checked) history.push({ label: 'Check-in', at: start.toISOString() })
  if (e.s === 'done') history.push({ label: 'Selesai', at: end.toISOString() })
  if (e.s === 'cancelled') {
    history.push({ label: e.cancelReason, at: new Date(start.getTime() - 3600 * 1000).toISOString() })
  }
  return {
    code: CODE(i),
    studentId: ADMIN_STUDENTS[e.student % ADMIN_STUDENTS.length].id,
    roomId: ADMIN_ROOMS[e.room % ADMIN_ROOMS.length].id,
    start: start.toISOString(),
    end: end.toISOString(),
    status: e.s,
    purpose: e.purpose,
    participants: e.p,
    createdAt: createdAt.toISOString(),
    statusHistory: history,
    cancelReason: e.cancelReason
  }
}

export function buildReservations(now = new Date()) {
  return RAW.map((_, i) => buildOne(now, i))
}

export const RESERVATION_STATUS = {
  waiting: { label: 'Menunggu', variant: 'waiting' },
  active: { label: 'Aktif', variant: 'active' },
  done: { label: 'Selesai', variant: 'done' },
  cancelled: { label: 'Dibatalkan', variant: 'cancelled' }
}

export const CANCEL_REASONS = ['Dibatalkan mahasiswa', 'Dibatalkan petugas', 'Tidak check-in dalam 15 menit']
