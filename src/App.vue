<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AppToast from '@/components/AppToast.vue'

const route = useRoute()
const layout = computed(() => (route.meta.layout === 'admin' ? AdminLayout : null))
</script>

<template>
  <component :is="layout" v-if="layout" />
  <RouterView v-else />
  <AppToast />
</template>
