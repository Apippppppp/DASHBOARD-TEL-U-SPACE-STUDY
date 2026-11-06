<script setup>
import {
  LayoutDashboard,
  CalendarCheck,
  ScanLine,
  Activity,
  History,
  Settings,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-vue-next'
import AdminSidebarItem from './AdminSidebarItem.vue'
import SidebarProfile from './SidebarProfile.vue'
import { usePermission } from '@/composables/admin/usePermission'

defineProps({
  mobileOpen: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false }
})
defineEmits(['close', 'toggle-collapse'])

const { can } = usePermission()

const menu = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/reservasi', label: 'Manajemen Reservasi', icon: CalendarCheck },
  { to: '/admin/scan', label: 'Scan QR Code', icon: ScanLine, accent: true },
  { to: '/admin/monitoring', label: 'Monitoring Ruangan', icon: Activity },
  { to: '/admin/riwayat', label: 'Riwayat Akses', icon: History },
  { to: '/admin/pengaturan', label: 'Pengaturan', icon: Settings, permission: 'manage.rooms' }
].filter((item) => !item.permission || can(item.permission))
</script>

<template>
  <aside
    class="sidebar-shell fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-navy-900 transition-transform duration-200 md:translate-x-0"
    :class="[
      mobileOpen ? 'translate-x-0' : '-translate-x-full',
      collapsed ? 'md:w-[72px]' : 'md:w-[264px]'
    ]"
  >
    <div class="flex h-16 shrink-0 items-center gap-3 px-4" :class="collapsed ? 'md:justify-center' : ''">
      <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white">
        <img src="/telkom-logo.svg" alt="Telkom University" class="h-7 w-7 object-contain" />
      </div>
      <div class="min-w-0" :class="collapsed ? 'md:hidden' : ''">
        <p class="truncate font-display text-base leading-tight font-semibold text-white">
          TEL-U StudySpace
        </p>
        <p class="truncate text-[12px] leading-tight text-white/70">
          Room Management &amp; Access Control
        </p>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto px-2 py-2" aria-label="Navigasi utama">
      <ul class="space-y-1">
        <li v-for="item in menu" :key="item.to">
          <AdminSidebarItem
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            :accent="item.accent"
            :collapsed="collapsed"
            @click="$emit('close')"
          />
        </li>
      </ul>
    </nav>

    <div class="hidden px-2 pb-1 md:block">
      <button
        type="button"
        class="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-white/70 hover:bg-navy-800 hover:text-white"
        :class="collapsed ? 'md:justify-center' : ''"
        :aria-label="collapsed ? 'Buka sidebar' : 'Tutup sidebar'"
        @click="$emit('toggle-collapse')"
      >
        <PanelLeftOpen v-if="collapsed" :size="18" class="shrink-0" />
        <PanelLeftClose v-else :size="18" class="shrink-0" />
        <span :class="collapsed ? 'md:hidden' : ''">Tutup sidebar</span>
      </button>
    </div>

    <SidebarProfile :collapsed="collapsed" />
  </aside>
</template>
