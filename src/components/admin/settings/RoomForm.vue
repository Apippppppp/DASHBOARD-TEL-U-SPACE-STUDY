<script setup>
import { reactive, ref, watch } from 'vue'
import SideDrawer from '@/components/admin/shared/SideDrawer.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  room: { type: Object, default: null },
  existingNames: { type: Array, default: () => [] }
})
const emit = defineEmits(['save', 'close'])

const TYPES = [
  { value: 'diskusi', label: 'Diskusi' },
  { value: 'belajar-mandiri', label: 'Belajar Mandiri' },
  { value: 'rapat', label: 'Rapat' },
  { value: 'kolaborasi', label: 'Kolaborasi' }
]
const FACILITIES = ['ac', 'proyektor', 'tv', 'papan', 'wifi', 'stopkontak', 'sound', 'dispenser', 'ergonomis']
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6)

const empty = () => ({
  id: null,
  name: '',
  type: 'diskusi',
  building: 'Gedung A',
  floor: 1,
  capacityMin: 1,
  capacityMax: 4,
  facilities: [],
  openHour: 7,
  closeHour: 21,
  deviceId: '',
  active: true
})

const form = reactive(empty())
const errors = reactive({})

function reset() {
  Object.assign(form, empty())
  Object.keys(errors).forEach((k) => delete errors[k])
  if (props.room) Object.assign(form, { ...props.room, facilities: [...(props.room.facilities || [])] })
}

watch(() => props.open, (open) => open && reset())

const inputClass =
  'h-10 w-full rounded-md border bg-white px-3 text-sm text-ink-900 focus:outline-none'

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  const name = form.name.trim()
  if (!name) errors.name = 'Masukkan nama ruangan.'
  else if (props.existingNames.includes(name.toLowerCase()) && !props.room) {
    errors.name = 'Nama ruangan sudah dipakai.'
  }
  if (!form.type) errors.type = 'Pilih tipe ruangan.'
  if (!String(form.building).trim()) errors.building = 'Masukkan gedung.'
  if (form.floor === '' || form.floor == null || Number.isNaN(Number(form.floor))) {
    errors.floor = 'Masukkan nomor lantai.'
  }
  const min = Number(form.capacityMin)
  const max = Number(form.capacityMax)
  if (!(min >= 1) || !(max >= 1)) errors.capacityMax = 'Kapasitas maksimum harus lebih besar atau sama dengan minimum.'
  else if (max < min) errors.capacityMax = 'Kapasitas maksimum harus lebih besar atau sama dengan minimum.'
  if (Number(form.closeHour) <= Number(form.openHour)) errors.closeHour = 'Jam tutup harus setelah jam buka.'
  if (form.deviceId && !/^[A-Za-z0-9]+$/.test(form.deviceId)) {
    errors.deviceId = 'ID perangkat hanya boleh berisi huruf dan angka.'
  }
  const first = Object.keys(errors)[0]
  if (first) document.getElementById(`rf-${first}`)?.focus()
  return !first
}

function submit() {
  if (!validate()) return
  emit('save', {
    ...form,
    name: form.name.trim(),
    floor: Number(form.floor),
    capacityMin: Number(form.capacityMin),
    capacityMax: Number(form.capacityMax),
    openHour: Number(form.openHour),
    closeHour: Number(form.closeHour),
    deviceId: form.deviceId.trim() || undefined
  })
}
</script>

<template>
  <SideDrawer :open="open" :title="room ? 'Ubah ruangan' : 'Tambah ruangan'" :width="520" @close="emit('close')">
    <form class="flex h-full flex-col" @submit.prevent="submit">
      <div class="flex-1 space-y-4 overflow-y-auto p-5">
        <div>
          <label for="rf-name" class="mb-1 block text-[13px] font-medium text-ink-700">Nama ruangan</label>
          <input id="rf-name" v-model="form.name" :class="[inputClass, errors.name ? 'border-red-600' : 'border-line focus:border-red-600']" />
          <p v-if="errors.name" class="mt-1 text-[12px] text-red-600">{{ errors.name }}</p>
        </div>

        <div>
          <label for="rf-type" class="mb-1 block text-[13px] font-medium text-ink-700">Tipe</label>
          <select id="rf-type" v-model="form.type" :class="[inputClass, errors.type ? 'border-red-600' : 'border-line focus:border-red-600']">
            <option v-for="t in TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="rf-building" class="mb-1 block text-[13px] font-medium text-ink-700">Gedung</label>
            <input id="rf-building" v-model="form.building" :class="[inputClass, errors.building ? 'border-red-600' : 'border-line focus:border-red-600']" />
            <p v-if="errors.building" class="mt-1 text-[12px] text-red-600">{{ errors.building }}</p>
          </div>
          <div>
            <label for="rf-floor" class="mb-1 block text-[13px] font-medium text-ink-700">Lantai</label>
            <input id="rf-floor" v-model="form.floor" type="number" min="1" :class="[inputClass, errors.floor ? 'border-red-600' : 'border-line focus:border-red-600']" />
            <p v-if="errors.floor" class="mt-1 text-[12px] text-red-600">{{ errors.floor }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="rf-capacityMin" class="mb-1 block text-[13px] font-medium text-ink-700">Kapasitas minimum</label>
            <input id="rf-capacityMin" v-model="form.capacityMin" type="number" min="1" :class="[inputClass, 'border-line focus:border-red-600']" />
          </div>
          <div>
            <label for="rf-capacityMax" class="mb-1 block text-[13px] font-medium text-ink-700">Kapasitas maksimum</label>
            <input id="rf-capacityMax" v-model="form.capacityMax" type="number" min="1" :class="[inputClass, errors.capacityMax ? 'border-red-600' : 'border-line focus:border-red-600']" />
            <p v-if="errors.capacityMax" class="mt-1 text-[12px] text-red-600">{{ errors.capacityMax }}</p>
          </div>
        </div>

        <div>
          <p class="mb-2 text-[13px] font-medium text-ink-700">Fasilitas</p>
          <div class="flex flex-wrap gap-3">
            <label v-for="f in FACILITIES" :key="f" class="flex items-center gap-2 text-sm capitalize">
              <input v-model="form.facilities" type="checkbox" :value="f" class="h-4 w-4 rounded border-line text-red-600" />
              {{ f }}
            </label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="rf-openHour" class="mb-1 block text-[13px] font-medium text-ink-700">Jam buka</label>
            <select id="rf-openHour" v-model="form.openHour" :class="[inputClass, 'border-line focus:border-red-600']">
              <option v-for="h in HOURS" :key="h" :value="h">{{ String(h).padStart(2, '0') }}:00</option>
            </select>
          </div>
          <div>
            <label for="rf-closeHour" class="mb-1 block text-[13px] font-medium text-ink-700">Jam tutup</label>
            <select id="rf-closeHour" v-model="form.closeHour" :class="[inputClass, errors.closeHour ? 'border-red-600' : 'border-line focus:border-red-600']">
              <option v-for="h in HOURS" :key="h" :value="h">{{ String(h).padStart(2, '0') }}:00</option>
            </select>
            <p v-if="errors.closeHour" class="mt-1 text-[12px] text-red-600">{{ errors.closeHour }}</p>
          </div>
        </div>

        <div>
          <label for="rf-deviceId" class="mb-1 block text-[13px] font-medium text-ink-700">ID perangkat (opsional)</label>
          <input id="rf-deviceId" v-model="form.deviceId" placeholder="Contoh: A" :class="[inputClass, errors.deviceId ? 'border-red-600' : 'border-line focus:border-red-600']" />
          <p v-if="errors.deviceId" class="mt-1 text-[12px] text-red-600">{{ errors.deviceId }}</p>
        </div>

        <div>
          <label for="rf-active" class="mb-1 block text-[13px] font-medium text-ink-700">Status</label>
          <select id="rf-active" v-model="form.active" :class="[inputClass, 'border-line focus:border-red-600']">
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
          Simpan ruangan
        </button>
      </div>
    </form>
  </SideDrawer>
</template>
