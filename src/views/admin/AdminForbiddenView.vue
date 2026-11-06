<script setup>
import EmptyState from '@/components/admin/shared/EmptyState.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <EmptyState
    title="Akses tidak diizinkan."
    text="Halaman ini hanya untuk admin."
    action-label="Kembali ke dashboard"
    @action="router.push('/admin')"
  />
</template>
