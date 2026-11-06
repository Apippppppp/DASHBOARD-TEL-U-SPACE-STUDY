<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminAuthStore } from '@/stores/admin/adminAuth'

const auth = useAdminAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

function submit() {
  auth.login({ role: 'petugas', name: '', email: email.value })
  router.replace(typeof route.query.next === 'string' ? route.query.next : '/admin')
}
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-surface p-4">
    <div class="w-full max-w-[400px] rounded-xl border border-line bg-white p-6 shadow-float">
      <div class="flex items-center gap-3">
        <div class="grid h-11 w-11 place-items-center rounded-xl bg-white ring-1 ring-line">
          <img src="/telkom-logo.svg" alt="Telkom University" class="h-8 w-8 object-contain" />
        </div>
        <div>
          <p class="font-display text-base font-semibold text-ink-900">TEL-U StudySpace</p>
          <p class="text-[12px] text-ink-500">Room Management &amp; Access Control</p>
        </div>
      </div>

      <h1 class="mt-6 font-display text-2xl font-semibold">Masuk petugas</h1>

      <form class="mt-5 space-y-4" @submit.prevent="submit">
        <div>
          <label for="login-email" class="mb-1 block text-[13px] font-medium text-ink-700">Email</label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            class="h-10 w-full rounded-md border border-line bg-white px-3 text-sm focus:border-red-600 focus:outline-none"
            placeholder="nama@telkomuniversity.ac.id"
          />
        </div>
        <div>
          <label for="login-password" class="mb-1 block text-[13px] font-medium text-ink-700">Kata sandi</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            class="h-10 w-full rounded-md border border-line bg-white px-3 text-sm focus:border-red-600 focus:outline-none"
          />
        </div>

        <button type="submit" class="h-11 w-full rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700">
          Masuk
        </button>
      </form>
    </div>
  </div>
</template>
