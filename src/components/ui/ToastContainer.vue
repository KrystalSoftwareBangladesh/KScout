<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<template>
  <div class="toasts">
    <TransitionGroup name="fade">
      <article
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.tone}`]"
      >
        <div>
          <strong>{{ toast.title }}</strong>
          <p>{{ toast.body }}</p>
        </div>
        <button type="button" class="toast__close" @click="toastStore.remove(toast.id)">
          ×
        </button>
      </article>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: var(--space-5);
  bottom: var(--space-5);
  z-index: 100;
  display: grid;
  gap: var(--space-3);
  width: min(380px, calc(100vw - 2rem));
}

.toast {
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(8, 18, 24, 0.96);
  box-shadow: var(--shadow-soft);
}

.toast strong,
.toast p {
  margin: 0;
}

.toast p {
  margin-top: var(--space-1);
  color: var(--text-muted);
  font-size: 0.9rem;
}

.toast--success {
  border-color: rgba(34, 224, 194, 0.28);
}

.toast--error {
  border-color: rgba(255, 108, 127, 0.28);
}

.toast--info {
  border-color: rgba(102, 167, 255, 0.28);
}

.toast__close {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 1.2rem;
}
</style>
