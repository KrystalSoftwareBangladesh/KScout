<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{
  open: boolean
  place: Record<string, any> | null
}>()

const emit = defineEmits<{
  close: []
}>()

const reviews = computed(() => props.place?.reviews || [])

const formatReviewTime = (value: unknown) => {
  if (typeof value === 'number') {
    return new Date(value * 1000).toLocaleDateString()
  }

  if (typeof value === 'string' && value) {
    const timestamp = Date.parse(value)
    return Number.isNaN(timestamp) ? value : new Date(timestamp).toLocaleDateString()
  }

  return 'Unknown time'
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="modal" @click.self="emit('close')">
        <div class="modal__dialog card">
          <div class="card-header">
            <div>
              <p class="eyebrow">Reviews</p>
              <h3>{{ place?.name || 'Business reviews' }}</h3>
            </div>

            <button type="button" class="button button--ghost button--sm" @click="emit('close')">
              Close
            </button>
          </div>

          <div class="card-body">
            <div v-if="reviews.length" class="reviews-list">
              <article v-for="(review, index) in reviews" :key="index" class="reviews-list__item">
                <div class="reviews-list__head">
                  <strong>{{ review.author || 'Anonymous' }}</strong>
                  <span class="badge badge--gold">★ {{ review.rating ?? '—' }}</span>
                </div>
                <p>{{ review.text || 'No review text supplied.' }}</p>
                <span class="dim">{{ formatReviewTime(review.time) }}</span>
              </article>
            </div>

            <div v-else class="modal__empty">
              No reviews were saved for this business yet.
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
