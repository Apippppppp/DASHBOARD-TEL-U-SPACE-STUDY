import { useAdminAuthStore } from '@/stores/admin/adminAuth'

// Peta peran -> izin antarmuka (design-admin 9). Otorisasi sebenarnya di backend.
export const PERMISSIONS = {
  admin: [
    'view.dashboard', 'view.reservasi', 'cancel.reservasi', 'view.scan',
    'view.monitoring', 'view.riwayat', 'export.riwayat', 'manage.rooms', 'manage.accounts'
  ],
  petugas: [
    'view.dashboard', 'view.reservasi', 'cancel.reservasi', 'view.scan',
    'view.monitoring', 'view.riwayat', 'export.riwayat'
  ]
}

export function usePermission() {
  const auth = useAdminAuthStore()
  const can = (permission) => (PERMISSIONS[auth.role] ?? []).includes(permission)
  return { can }
}
