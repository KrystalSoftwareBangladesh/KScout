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
