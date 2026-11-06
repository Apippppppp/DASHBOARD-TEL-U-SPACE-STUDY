<script setup>
import { reactive, watch } from 'vue'
import SideDrawer from '@/components/admin/shared/SideDrawer.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  account: { type: Object, default: null },
  existingEmails: { type: Array, default: () => [] }
})
const emit = defineEmits(['save', 'close'])

const empty = () => ({ id: null, name: '', email: '', role: 'petugas', active: true })
const form = reactive(empty())
const errors = reactive({})

function reset() {
  Object.assign(form, empty())
  Object.keys(errors).forEach((k) => delete errors[k])
  if (props.account) Object.assign(form, props.account)
}

watch(() => props.open, (open) => open && reset())

const inputClass = 'h-10 w-full rounded-md border bg-white px-3 text-sm text-ink-900 focus:outline-none'

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name.trim()) errors.name = 'Masukkan nama.'
  const email = form.email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Masukkan email yang valid.'
  else if (props.existingEmails.includes(email) && !props.account) errors.email = 'Email sudah dipakai.'
  const first = Object.keys(errors)[0]
  if (first) document.getElementById(`af-${first}`)?.focus()
  return !first
}

function submit() {
  if (!validate()) return
  emit('save', { ...form, name: form.name.trim(), email: form.email.trim().toLowerCase() })
}
</script>

<template>
  <SideDrawer :open="open" :title="account ? 'Ubah akun' : 'Tambah akun'" :width="480" @close="emit('close')">
    <form class="flex h-full flex-col" @submit.prevent="submit">
      <div class="flex-1 space-y-4 overflow-y-auto p-5">
        <div>
          <label for="af-name" class="mb-1 block text-[13px] font-medium text-ink-700">Nama</label>
          <input id="af-name" v-model="form.name" :class="[inputClass, errors.name ? 'border-red-600' : 'border-line focus:border-red-600']" />
          <p v-if="errors.name" class="mt-1 text-[12px] text-red-600">{{ errors.name }}</p>
        </div>
        <div>
          <label for="af-email" class="mb-1 block text-[13px] font-medium text-ink-700">Email</label>
          <input id="af-email" v-model="form.email" type="email" :class="[inputClass, errors.email ? 'border-red-600' : 'border-line focus:border-red-600']" />
          <p v-if="errors.email" class="mt-1 text-[12px] text-red-600">{{ errors.email }}</p>
        </div>
        <div>
          <label for="af-role" class="mb-1 block text-[13px] font-medium text-ink-700">Peran</label>
          <select id="af-role" v-model="form.role" :class="[inputClass, 'border-line focus:border-red-600']">
            <option value="admin">Admin</option>
            <option value="petugas">Petugas</option>
          </select>
        </div>
        <div>
          <label for="af-active" class="mb-1 block text-[13px] font-medium text-ink-700">Status</label>
          <select id="af-active" v-model="form.active" :class="[inputClass, 'border-line focus:border-red-600']">
            <option :value="true">Aktif</option>
            <option :value="false">Nonaktif</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end gap-3 border-t border-line p-5">
        <button type="button" class="h-10 rounded-md border border-line px-4 text-sm font-medium text-ink-700 hover:bg-surface" @click="emit('close')">
          Batal
        </button>
        <button type="submit" class="h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700">
          Simpan akun
        </button>
      </div>
    </form>
  </SideDrawer>
</template>
