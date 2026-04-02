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

<style scoped>
.stat-card {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
}

.stat-card__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  font-size: 1.2rem;
  border: 1px solid var(--border);
}

.stat-card__icon--accent {
  background: var(--accent-dim);
  color: var(--accent);
  box-shadow: inset 0 0 0 1px rgba(34, 224, 194, 0.12);
}

.stat-card__icon--gold {
  background: var(--gold-dim);
  color: var(--gold);
}

.stat-card__icon--blue {
  background: var(--blue-dim);
  color: var(--blue);
}

.stat-card__body {
  display: grid;
  gap: var(--space-2);
}

.stat-card__body p,
.stat-card__body span {
  margin: 0;
}

.stat-card__body p {
  color: var(--text-muted);
  font-size: 0.92rem;
}

.stat-card__body strong {
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1;
  letter-spacing: 0.04em;
}

.stat-card__body span {
  color: var(--text-dim);
  font-size: 0.84rem;
}

.stat-card__skeleton {
  width: 120px;
  height: 30px;
}
</style>
