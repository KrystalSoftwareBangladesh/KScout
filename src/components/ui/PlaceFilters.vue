<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    open?: boolean
  }>(),
  {
    open: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const localFilters = reactive({
  minRating: 0,
  hasPhone: false,
  hasWebsite: false,
  isOpen: false,
  status: '',
})

let timeoutId = 0

watch(
  () => props.modelValue,
  (value) => {
    Object.assign(localFilters, {
      minRating: Number(value?.minRating || 0),
      hasPhone: Boolean(value?.hasPhone),
      hasWebsite: Boolean(value?.hasWebsite),
      isOpen: Boolean(value?.isOpen),
      status: String(value?.status || ''),
    })
  },
  { deep: true, immediate: true },
)

watch(
  localFilters,
  () => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      emit('update:modelValue', { ...localFilters })
    }, 300)
  },
  { deep: true },
)
</script>

<template>
  <div :class="['filters', { 'filters--open': open }]">
    <div class="filters__inner card card--inset">
      <div class="filters__grid">
        <div class="field">
          <label for="min-rating">Min rating</label>
          <input
            id="min-rating"
            v-model="localFilters.minRating"
            class="filters__range"
            type="range"
            min="0"
            max="5"
            step="0.5"
          />
          <span class="field-help">{{ Number(localFilters.minRating).toFixed(1) }} stars or higher</span>
        </div>

        <label class="filters__toggle">
          <input v-model="localFilters.hasPhone" type="checkbox" />
          <span>Has phone number</span>
        </label>

        <label class="filters__toggle">
          <input v-model="localFilters.hasWebsite" type="checkbox" />
          <span>Has website</span>
        </label>

        <label class="filters__toggle">
          <input v-model="localFilters.isOpen" type="checkbox" />
          <span>Open now</span>
        </label>

        <div class="field">
          <label for="status-filter">Business status</label>
          <select id="status-filter" v-model="localFilters.status" class="select">
            <option value="">All statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="CLOSED_TEMPORARILY">Closed temporarily</option>
            <option value="CLOSED_PERMANENTLY">Closed permanently</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
