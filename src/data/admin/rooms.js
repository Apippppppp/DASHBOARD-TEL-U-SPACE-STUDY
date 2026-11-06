// Data mock ruangan. deviceId hanya untuk ruangan berperangkat (topic studyspace/room/A/sensors).
export const ADMIN_ROOMS = [
  { id: 'room-a1', name: 'Ruang Diskusi A1', type: 'diskusi', building: 'Gedung A', floor: 2, capacityMin: 3, capacityMax: 6, facilities: ['proyektor', 'papan', 'ac', 'wifi'], openDays: [1, 2, 3, 4, 5, 6], openHour: 7, closeHour: 21, deviceId: 'A', active: true },
  { id: 'room-a2', name: 'Ruang Diskusi A2', type: 'diskusi', building: 'Gedung A', floor: 2, capacityMin: 2, capacityMax: 6, facilities: ['proyektor', 'papan', 'ac', 'wifi'], openDays: [1, 2, 3, 4, 5, 6], openHour: 7, closeHour: 21, active: true },
  { id: 'room-b1', name: 'Ruang Diskusi B1', type: 'diskusi', building: 'Gedung B', floor: 1, capacityMin: 3, capacityMax: 6, facilities: ['proyektor', 'ac', 'wifi'], openDays: [1, 2, 3, 4, 5, 6], openHour: 7, closeHour: 21, active: true },
  { id: 'room-b3', name: 'Ruang Belajar B3', type: 'belajar-mandiri', building: 'Gedung B', floor: 3, capacityMin: 1, capacityMax: 2, facilities: ['ac', 'wifi', 'stopkontak', 'ergonomis'], openDays: [1, 2, 3, 4, 5, 6], openHour: 7, closeHour: 21, active: true },
  { id: 'room-c1', name: 'Ruang Rapat C1', type: 'rapat', building: 'Gedung C', floor: 1, capacityMin: 4, capacityMax: 10, facilities: ['tv', 'sound', 'ac', 'wifi', 'dispenser'], openDays: [1, 2, 3, 4, 5], openHour: 8, closeHour: 18, active: true },
  { id: 'room-c3', name: 'Ruang Rapat C3', type: 'rapat', building: 'Gedung C', floor: 3, capacityMin: 6, capacityMax: 10, facilities: ['tv', 'proyektor', 'ac', 'wifi'], openDays: [1, 2, 3, 4, 5], openHour: 8, closeHour: 17, active: true },
  { id: 'room-a5', name: 'Ruang Kolaborasi A5', type: 'kolaborasi', building: 'Gedung A', floor: 5, capacityMin: 6, capacityMax: 12, facilities: ['proyektor', 'tv', 'ac', 'wifi', 'sound'], openDays: [1, 2, 3, 4, 5, 6], openHour: 7, closeHour: 21, active: true },
  { id: 'room-d2', name: 'Ruang Belajar D2', type: 'belajar-mandiri', building: 'Gedung D', floor: 2, capacityMin: 1, capacityMax: 2, facilities: ['ac', 'wifi', 'stopkontak'], openDays: [1, 2, 3, 4, 5, 6], openHour: 7, closeHour: 21, active: false }
]

export const getAdminRoomById = (id) => ADMIN_ROOMS.find((r) => r.id === id)
