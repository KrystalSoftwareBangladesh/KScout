<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  session: Record<string, any>
  isFetching: boolean
  lastResult?: Record<string, any> | null
}>()

const emit = defineEmits<{
  fetch: [id: string | number]
  delete: [id: string | number]
}>()

const progress = computed(() => {
  const total = Number(props.session.total_cells || 0)
  const done = Number(props.session.cells_done || 0)

  if (!total) {
    return 0
  }

  return Math.min((done / total) * 100, 100)
})

const lastFetchedText = computed(() => {
  const input = props.session.last_fetched_at

  if (!input) {
    return 'Never fetched'
  }

  const seconds = Math.floor((Date.now() - new Date(input).getTime()) / 1000)

  if (seconds < 60) {
    return `${seconds}s ago`
  }

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`
  }

  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return `${Math.floor(seconds / 86400)}d ago`
})

const confirmDelete = () => {
  const shouldDelete = window.confirm(
    `Delete the session for "${props.session.query}" in "${props.session.location}"?`,
  )

  if (shouldDelete) {
    emit('delete', props.session.id)
  }
}
</script>

<template>
  <article class="session-card card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Collection Session</p>
        <h3>{{ session.query }}</h3>
        <p class="session-card__location">{{ session.location }}</p>
      </div>

      <span :class="['badge', session.is_exhausted ? 'badge--gold' : 'badge--accent']">
        {{ session.is_exhausted ? 'Exhausted' : 'Active' }}
      </span>
    </div>

    <div class="card-body">
      <div class="session-card__progress-row">
        <strong>{{ session.cells_done || 0 }} / {{ session.total_cells || 0 }} cells completed</strong>
        <span>{{ Math.round(progress) }}%</span>
      </div>

      <div class="progress">
        <span :style="{ width: `${progress}%` }" />
      </div>

      <div class="session-card__stats">
        <div>
          <strong>{{ session.total_places || 0 }}</strong>
          <span>places found</span>
        </div>
        <div>
          <strong>{{ session.pages_fetched || 0 }}</strong>
          <span>pages fetched</span>
        </div>
        <div>
          <strong>{{ lastFetchedText }}</strong>
          <span>last fetch</span>
        </div>
      </div>

      <div class="session-card__actions">
        <button
          type="button"
          class="button"
          :disabled="isFetching || session.is_exhausted"
          @click="emit('fetch', session.id)"
        >
          {{ isFetching ? 'Fetching...' : session.is_exhausted ? 'Session exhausted' : 'Fetch Next Cell' }}
        </button>

        <RouterLink
          class="button button--ghost"
          :to="{ path: '/grid', query: { session: session.id } }"
        >
          View Grid
        </RouterLink>

        <button type="button" class="button button--danger" @click="confirmDelete">
          Delete
        </button>
      </div>

      <Transition name="fade">
        <section v-if="lastResult" class="session-card__result">
          <div>
            <span>Retrieved</span>
            <strong>{{ lastResult.fetched || 0 }}</strong>
          </div>
          <div>
            <span>New Saved</span>
            <strong>{{ lastResult.inserted || 0 }}</strong>
          </div>
          <div>
            <span>Duplicates Skipped</span>
            <strong>{{ lastResult.duplicates_skipped || 0 }}</strong>
          </div>
          <div>
            <span>Cell Index</span>
            <strong>#{{ lastResult.cell_index ?? '—' }}</strong>
          </div>
        </section>
      </Transition>
    </div>
  </article>
</template>
