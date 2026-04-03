<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useCountUp } from '@/composables/useCountUp'

const props = withDefaults(
  defineProps<{
    label: string
    value: number
    icon?: string
    hint?: string
    tone?: 'accent' | 'gold' | 'blue'
    decimals?: number
    loading?: boolean
  }>(),
  {
    icon: '•',
    hint: '',
    tone: 'accent',
    decimals: 0,
    loading: false,
  },
)

const animatedValue = useCountUp(toRef(props, 'value'), 900)

const formattedValue = computed(() => {
  if (props.decimals > 0) {
    return Number(animatedValue.value || 0).toFixed(props.decimals)
  }

  return new Intl.NumberFormat().format(Math.round(Number(animatedValue.value || 0)))
})
</script>

<template>
  <article class="stat-card card">
    <div class="stat-card__icon" :class="`stat-card__icon--${tone}`">
      {{ icon }}
    </div>

    <div class="stat-card__body">
      <p>{{ label }}</p>
      <strong v-if="!loading">{{ formattedValue }}</strong>
      <div v-else class="skeleton stat-card__skeleton" />
      <span>{{ hint }}</span>
    </div>
  </article>
</template>
