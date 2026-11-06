<script setup>
const props = defineProps({
  columns: { type: Array, required: true }, // { key, label, class? }
  rows: { type: Array, required: true },
  rowKey: { type: [String, Function], default: 'id' },
  loading: { type: Boolean, default: false },
  rowClickable: { type: Boolean, default: false },
  emptyTitle: { type: String, default: 'Belum ada data.' },
  emptyText: { type: String, default: '' },
  skeletonRows: { type: Number, default: 6 }
})

const emit = defineEmits(['row-click'])

const keyOf = (row, i) =>
  typeof props.rowKey === 'function' ? props.rowKey(row) : (row[props.rowKey] ?? i)
</script>

<template>
  <div>
    <!-- Desktop -->
    <table class="hidden w-full border-collapse md:table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            class="sticky top-0 z-10 h-10 border-b border-line bg-surface px-3 text-left text-[12px] font-medium text-ink-500"
            :class="col.class"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="n in skeletonRows" :key="`sk-${n}`" class="h-14 border-b border-line">
            <td v-for="col in columns" :key="col.key" class="px-3" :class="col.class">
              <span class="block h-3.5 w-24 animate-pulse rounded bg-surface" />
            </td>
          </tr>
        </template>
        <template v-else-if="rows.length">
          <tr
            v-for="(row, i) in rows"
            :key="keyOf(row, i)"
            class="h-14 border-b border-line hover:bg-surface"
            :class="rowClickable ? 'cursor-pointer' : ''"
            @click="rowClickable && emit('row-click', row)"
          >
            <td v-for="col in columns" :key="col.key" class="px-3 align-middle" :class="col.class">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Empty (desktop) -->
    <div v-if="!loading && !rows.length" class="hidden border-b border-line py-12 text-center md:block">
      <p class="font-display text-base font-semibold text-ink-900">{{ emptyTitle }}</p>
      <p v-if="emptyText" class="mt-1 text-sm text-ink-500">{{ emptyText }}</p>
      <slot name="empty-action" />
    </div>

    <!-- Mobile -->
    <div class="md:hidden">
      <template v-if="loading">
        <div v-for="n in 4" :key="`msk-${n}`" class="border-b border-line py-4">
          <span class="block h-4 w-40 animate-pulse rounded bg-surface" />
          <span class="mt-2 block h-3 w-24 animate-pulse rounded bg-surface" />
        </div>
      </template>
      <template v-else-if="rows.length">
        <slot name="mobile" :rows="rows">
          <div
            v-for="(row, i) in rows"
            :key="keyOf(row, i)"
            class="border-b border-line py-4"
            :class="rowClickable ? 'cursor-pointer' : ''"
            @click="rowClickable && emit('row-click', row)"
          >
            <p class="text-sm font-medium text-ink-900">{{ row[columns[0]?.key] }}</p>
            <p class="text-[13px] text-ink-500">{{ row[columns[1]?.key] }}</p>
          </div>
        </slot>
      </template>
      <div v-else class="py-10 text-center">
        <p class="font-display text-base font-semibold text-ink-900">{{ emptyTitle }}</p>
        <p v-if="emptyText" class="mt-1 text-sm text-ink-500">{{ emptyText }}</p>
      </div>
    </div>
  </div>
</template>
