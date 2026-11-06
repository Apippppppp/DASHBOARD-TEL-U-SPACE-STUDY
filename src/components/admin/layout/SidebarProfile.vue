<script setup>
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'
import { useAdminAuthStore } from '@/stores/admin/adminAuth'
import { initials } from '@/utils/format'

defineProps({ collapsed: { type: Boolean, default: false } })

const auth = useAdminAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="border-t border-navy-700 p-3">
    <div class="flex items-center gap-3" :class="collapsed ? 'md:justify-center' : ''">
      <span
        class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-600 font-display text-sm font-semibold text-white"
      >
        {{ initials(auth.displayName) }}
      </span>
      <div class="min-w-0" :class="collapsed ? 'md:hidden' : ''">
        <p class="truncate text-sm font-medium text-white">{{ auth.displayName }}</p>
        <span
          class="mt-0.5 inline-flex h-5 items-center rounded-sm bg-white/12 px-1.5 text-[11px] font-medium tracking-wide text-white/90 capitalize"
        >
          {{ auth.role }}
        </span>
      </div>
    </div>
    <button
      type="button"
      class="mt-2 flex h-10 w-full items-center gap-2 rounded-md px-3 text-sm text-white/80 hover:bg-navy-800 hover:text-white"
      :class="collapsed ? 'md:justify-center' : ''"
      @click="logout"
    >
      <LogOut :size="18" class="shrink-0" />
      <span :class="collapsed ? 'md:hidden' : ''">Keluar</span>
    </button>
  </div>
</template>
