<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useBridgeSocket } from '@/composables/admin/useBridgeSocket'
import AdminSidebar from '@/components/admin/layout/AdminSidebar.vue'
import AdminHeader from '@/components/admin/layout/AdminHeader.vue'
import { useUiStore } from '@/stores/ui'

const { start, stop } = useBridgeSocket()
const ui = useUiStore()
const mobileOpen = ref(false)

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <div class="min-h-screen bg-white">
    <a
      href="#konten"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-red-600 focus:px-4 focus:py-2 focus:text-white"
    >
      Lewati ke konten
    </a>

    <AdminSidebar
      :mobile-open="mobileOpen"
      :collapsed="ui.sidebarCollapsed"
      @close="mobileOpen = false"
      @toggle-collapse="ui.toggleSidebar()"
    />

    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 bg-ink-900/40 md:hidden"
      @click="mobileOpen = false"
    />

    <div :class="ui.sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-[264px]'">
      <AdminHeader @menu="mobileOpen = true" />
      <main id="konten" class="mx-auto max-w-[1440px] px-4 py-6 md:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
