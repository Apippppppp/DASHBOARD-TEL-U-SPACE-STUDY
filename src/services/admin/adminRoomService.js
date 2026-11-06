import { USE_MOCK, http } from './http'
import { db, delay } from './mock/db'

export async function listRooms() {
  if (USE_MOCK) {
    await delay()
    return db.rooms.map((r) => ({ ...r }))
  }
  const { data } = await http.get('/rooms')
  return data
}

export async function saveRoom(room) {
  if (USE_MOCK) {
    await delay()
    if (room.id) {
      const existing = db.rooms.find((r) => r.id === room.id)
      if (existing) {
        Object.assign(existing, room)
        return { ...existing }
      }
    }
    const created = { ...room, id: `room-${Date.now()}` }
    db.rooms.push(created)
    return { ...created }
  }
  const { data } = room.id ? await http.put(`/rooms/${room.id}`, room) : await http.post('/rooms', room)
  return data
}

export async function setRoomActive(id, active) {
  if (USE_MOCK) {
    await delay()
    const r = db.rooms.find((x) => x.id === id)
    if (r) r.active = active
    return { ...r }
  }
  const { data } = await http.patch(`/rooms/${id}`, { active })
  return data
}
