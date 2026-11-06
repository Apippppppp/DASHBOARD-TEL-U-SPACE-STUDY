<script setup>
import { computed, onMounted, ref } from 'vue'
import RoomSettingsTable from '@/components/admin/settings/RoomSettingsTable.vue'
import AccountTable from '@/components/admin/settings/AccountTable.vue'
import RoomForm from '@/components/admin/settings/RoomForm.vue'
import AccountForm from '@/components/admin/settings/AccountForm.vue'
import ConfirmDialog from '@/components/admin/shared/ConfirmDialog.vue'
import { useAdminSettingsStore } from '@/stores/admin/adminSettings'
import { useAdminReservationsStore } from '@/stores/admin/adminReservations'
import { useAdminAuthStore } from '@/stores/admin/adminAuth'
import { useToastStore } from '@/stores/toast'

const settings = useAdminSettingsStore()
const reservations = useAdminReservationsStore()
const auth = useAdminAuthStore()
const toast = useToastStore()

const tab = ref('ruangan')
const roomFormOpen = ref(false)
const editingRoom = ref(null)
const accountFormOpen = ref(false)
const editingAccount = ref(null)

const confirm = ref({ open: false, title: '', message: '', confirmLabel: 'Lanjutkan', danger: false, action: null })

onMounted(() => {
  if (!settings.rooms.length) settings.fetchRooms()
  if (!settings.accounts.length) settings.fetchAccounts()
  if (!reservations.rows.length) reservations.fetch()
})

const roomNames = computed(() => settings.rooms.map((r) => r.name.toLowerCase()).filter((n) => n !== editingRoom.value?.name?.toLowerCase()))
const accountEmails = computed(() => settings.accounts.map((a) => a.email.toLowerCase()))

function openRoom(room = null) {
  editingRoom.value = room
  roomFormOpen.value = true
}

async function saveRoom(room) {
  await settings.saveRoom({ ...room, id: editingRoom.value?.id })
  roomFormOpen.value = false
  toast.push('Ruangan disimpan.')
}

function askRoomToggle(room) {
  if (!room.active) {
    settings.setRoomActive(room.id, true)
    toast.push('Ruangan diaktifkan.')
    return
  }
  const upcoming = reservations.enriched.filter(
    (r) => r.roomId === room.id && (r.status === 'waiting' || r.status === 'active') && new Date(r.start) > new Date()
  )
  if (!upcoming.length) {
    settings.setRoomActive(room.id, false)
    toast.push('Ruangan dinonaktifkan.')
    return
  }
  confirm.value = {
    open: true,
    title: 'Nonaktifkan ruangan?',
    message: `${room.name} punya ${upcoming.length} reservasi mendatang. Menonaktifkan ruangan tidak membatalkan reservasi tersebut. Lanjutkan?`,
    confirmLabel: 'Nonaktifkan',
    danger: true,
    action: async () => {
      await settings.setRoomActive(room.id, false)
      toast.push('Ruangan dinonaktifkan.')
    }
  }
}

function openAccount(account = null) {
  editingAccount.value = account
  accountFormOpen.value = true
}

async function saveAccount(account) {
  await settings.saveAccount({ ...account, id: editingAccount.value?.id })
  accountFormOpen.value = false
  toast.push('Akun disimpan.')
}

async function resetPassword(account) {
  await settings.resetPassword(account.id)
  toast.push('Tautan atur ulang dikirim ke email.')
}

function askAccountToggle(account) {
  if (!account.active) {
    settings.setAccountActive(account.id, true)
    toast.push('Akun diaktifkan.')
    return
  }
  if (account.email.toLowerCase() === auth.user?.email?.toLowerCase()) {
    toast.push('Anda tidak bisa menonaktifkan akun sendiri.', 'error')
    return
  }
  if (account.role === 'admin' && settings.accounts.filter((a) => a.role === 'admin' && a.active).length <= 1) {
    toast.push('Harus ada minimal satu admin aktif.', 'error')
    return
  }
  confirm.value = {
    open: true,
    title: 'Nonaktifkan akun?',
    message: `Akun ${account.name} tidak akan bisa masuk sampai diaktifkan kembali.`,
    confirmLabel: 'Nonaktifkan',
    danger: true,
    action: async () => {
      await settings.setAccountActive(account.id, false)
      toast.push('Akun dinonaktifkan.')
    }
  }
}

async function runConfirm() {
  const action = confirm.value.action
  confirm.value.open = false
  await action?.()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-6 border-b border-line">
      <button
        type="button"
        class="relative pb-3 text-sm font-medium"
        :class="tab === 'ruangan' ? 'border-b-2 border-red-600 text-red-700' : 'text-ink-500 hover:text-ink-900'"
        @click="tab = 'ruangan'"
      >
        Ruangan
      </button>
      <button
        type="button"
        class="relative pb-3 text-sm font-medium"
        :class="tab === 'akun' ? 'border-b-2 border-red-600 text-red-700' : 'text-ink-500 hover:text-ink-900'"
        @click="tab = 'akun'"
      >
        Akun
      </button>
    </div>

    <template v-if="tab === 'ruangan'">
      <div class="flex items-center justify-between">
        <p class="text-sm text-ink-500">Kelola ruangan, jam buka, dan perangkat.</p>
        <button
          type="button"
          class="h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
          @click="openRoom()"
        >
          Tambah ruangan
        </button>
      </div>
      <div class="rounded-lg border border-line">
        <RoomSettingsTable :rooms="settings.rooms" :loading="settings.loading" @edit="openRoom" @toggle="askRoomToggle" />
      </div>
    </template>

    <template v-else>
      <div class="flex items-center justify-between">
        <p class="text-sm text-ink-500">Kelola akun admin dan petugas.</p>
        <button
          type="button"
          class="h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
          @click="openAccount()"
        >
          Tambah akun
        </button>
      </div>
      <div class="rounded-lg border border-line">
        <AccountTable
          :accounts="settings.accounts"
          :loading="settings.loading"
          @edit="openAccount"
          @reset="resetPassword"
          @toggle="askAccountToggle"
        />
      </div>
    </template>

    <RoomForm
      :open="roomFormOpen"
      :room="editingRoom"
      :existing-names="roomNames"
      @save="saveRoom"
      @close="roomFormOpen = false"
    />
    <AccountForm
      :open="accountFormOpen"
      :account="editingAccount"
      :existing-emails="accountEmails"
      @save="saveAccount"
      @close="accountFormOpen = false"
    />
    <ConfirmDialog
      :open="confirm.open"
      :title="confirm.title"
      :message="confirm.message"
      :confirm-label="confirm.confirmLabel"
      :danger="confirm.danger"
      @confirm="runConfirm"
      @cancel="confirm.open = false"
    />
  </div>
</template>