<script setup lang="ts">
defineProps<{
  title: string
  body: string
  actionLabel?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="empty card card--inset">
    <div class="empty__icon">⌁</div>
    <h3>{{ title }}</h3>
    <p>{{ body }}</p>
    <button
      v-if="actionLabel"
      type="button"
      class="button button--soft"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.empty {
  display: grid;
  place-items: center;
  gap: var(--space-3);
  min-height: 240px;
  padding: var(--space-6);
  text-align: center;
}

.empty__icon {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border: 1px solid var(--border2);
  border-radius: 20px;
  background: rgba(17, 50, 57, 0.82);
  color: var(--accent);
  font-size: 1.6rem;
}

.empty h3,
.empty p {
  margin: 0;
}

.empty p {
  max-width: 48ch;
  color: var(--text-muted);
}
</style>
