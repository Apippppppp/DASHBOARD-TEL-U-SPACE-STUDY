import { USE_MOCK, http } from './http'
import { db, delay } from './mock/db'

export async function listAccessLogs() {
  if (USE_MOCK) {
    await delay()
    return db.accessLogs.map((l) => ({ ...l }))
  }
  const { data } = await http.get('/access-logs')
  return data
}
