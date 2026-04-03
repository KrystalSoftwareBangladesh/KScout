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
