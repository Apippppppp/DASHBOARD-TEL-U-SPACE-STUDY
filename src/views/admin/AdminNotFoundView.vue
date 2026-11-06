<script setup>
import EmptyState from '@/components/admin/shared/EmptyState.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <EmptyState
    title="Halaman tidak ditemukan."
    text="Alamat yang Anda buka tidak tersedia di dashboard ini."
    action-label="Kembali ke dashboard"
    @action="router.push('/admin')"
  />
</template>
