<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  to: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: [Object, Function], required: true },
  accent: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false }
})

const route = useRoute()
const active = computed(
  () => route.path === props.to || (props.to !== '/admin' && route.path.startsWith(props.to))
)
</script>

<template>
  <RouterLink
    :to="to"
    :title="label"
    :aria-current="active ? 'page' : undefined"
    class="relative flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors"
    :class="[
      collapsed ? 'md:justify-center' : 'md:justify-start',
      active ? 'bg-white/12 text-white' : 'text-white/80 hover:bg-navy-800 hover:text-white'
    ]"
  >
    <span
      v-if="active"
      class="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r bg-[#F2D6D9]"
    />
    <span
      v-if="accent"
      class="grid h-[26px] w-[26px] shrink-0 place-items-center rounded bg-red-600 text-white"
    >
      <component :is="icon" :size="16" />
    </span>
    <component v-else :is="icon" :size="20" class="shrink-0" />
    <span class="truncate" :class="collapsed ? 'md:hidden' : ''">{{ label }}</span>
  </RouterLink>
</template>
