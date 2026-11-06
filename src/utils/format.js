import { format, formatDistanceToNowStrict, differenceInMinutes } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export const fmtDate = (d) => format(new Date(d), 'd MMM yyyy', { locale: idLocale })
export const fmtTime = (d) => format(new Date(d), 'HH:mm', { locale: idLocale })
export const fmtDateTime = (d) => format(new Date(d), 'd MMM yyyy, HH:mm', { locale: idLocale })
export const fmtDateTimeLong = (d) =>
  format(new Date(d), 'EEEE, d MMM yyyy, HH:mm', { locale: idLocale })
export const fmtClockHeader = (d) =>
  format(new Date(d), "EEE, d MMM yyyy, HH:mm", { locale: idLocale })

export const relativeFromNow = (d) => formatDistanceToNowStrict(new Date(d), { locale: idLocale, addSuffix: true })

// "3 dtk lalu" / "4 mnt lalu"
export const ageLabel = (ms) => {
  if (ms == null || !isFinite(ms)) return ''
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s} dtk lalu`
  const m = Math.round(s / 60)
  if (m < 60) return `${m} mnt lalu`
  const h = Math.round(m / 60)
  return `${h} jam lalu`
}

export const minutesLate = (startISO, now = Date.now()) =>
  Math.max(0, differenceInMinutes(now, new Date(startISO)))

export const decimalId = (n, digits = 1) =>
  Number(n).toFixed(digits).replace('.', ',')

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export const timeRange = (start, end) => `${fmtTime(start)}–${fmtTime(end)}`

export const ID = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  days: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
}
