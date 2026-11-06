import { createRouter, createWebHistory } from 'vue-router'
import { useAdminAuthStore } from '@/stores/admin/adminAuth'

const ADMIN = ['admin', 'petugas']

const routes = [
  { path: '/', redirect: '/admin' },
  {
    path: '/admin/masuk',
    name: 'admin-login',
    component: () => import('@/views/admin/AdminLoginView.vue'),
    meta: { layout: 'plain' }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { layout: 'admin', roles: ADMIN, title: 'Dashboard' }
  },
  {
    path: '/admin/reservasi',
    name: 'admin-reservations',
    component: () => import('@/views/admin/AdminReservationsView.vue'),
    meta: { layout: 'admin', roles: ADMIN, title: 'Manajemen Reservasi' }
  },
  {
    path: '/admin/scan',
    name: 'admin-scan',
    component: () => import('@/views/admin/AdminScanView.vue'),
    meta: { layout: 'admin', roles: ADMIN, title: 'Scan QR Code' }
  },
  {
    path: '/admin/monitoring',
    name: 'admin-monitoring',
    component: () => import('@/views/admin/AdminMonitoringView.vue'),
    meta: { layout: 'admin', roles: ADMIN, title: 'Monitoring Ruangan' }
  },
  {
    path: '/admin/riwayat',
    name: 'admin-access-log',
    component: () => import('@/views/admin/AdminAccessLogView.vue'),
    meta: { layout: 'admin', roles: ADMIN, title: 'Riwayat Akses' }
  },
  {
    path: '/admin/pengaturan',
    name: 'admin-settings',
    component: () => import('@/views/admin/AdminSettingsView.vue'),
    meta: { layout: 'admin', roles: ['admin'], title: 'Pengaturan' }
  },
  {
    path: '/admin/terlarang',
    name: 'admin-forbidden',
    component: () => import('@/views/admin/AdminForbiddenView.vue'),
    meta: { layout: 'admin', title: 'Akses tidak diizinkan' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'admin-not-found',
    component: () => import('@/views/admin/AdminNotFoundView.vue'),
    meta: { layout: 'admin', title: 'Halaman tidak ditemukan' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const auth = useAdminAuthStore()
  if (!to.meta.roles) return true
  if (!auth.isAuthenticated) {
    return { name: 'admin-login', query: { next: to.fullPath } }
  }
  if (!to.meta.roles.includes(auth.role)) {
    return { name: 'admin-forbidden' }
  }
  return true
})

export default router
