<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GridMap from '@/components/ui/GridMap.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useSessionsStore } from '@/stores/sessions'

const route = useRoute()
const sessionsStore = useSessionsStore()

const selectedSessionId = ref('')
const loadingGrid = ref(false)
const focusedCellId = ref<string | number | null>(null)

const currentSession = computed(() => sessionsStore.byId(selectedSessionId.value))
const currentCells = computed(() => sessionsStore.grids[selectedSessionId.value] || [])

const loadGrid = async () => {
  if (!selectedSessionId.value) {
    return
  }

  loadingGrid.value = true

  try {
    await sessionsStore.loadGrid(selectedSessionId.value)
  } catch {
    // Store action already surfaced the error via toast.
  } finally {
    loadingGrid.value = false
  }
}

onMounted(async () => {
  if (!sessionsStore.list.length) {
    await sessionsStore.loadAll()
  }

  selectedSessionId.value = String(route.query.session || sessionsStore.list[0]?.id || '')
})

watch(selectedSessionId, async () => {
  focusedCellId.value = null
  await loadGrid()
})
</script>

<template>
  <div class="page-shell">
    <section class="page-section">
      <div class="page-heading">
        <div>
          <h1>Grid View</h1>
          <p>
            Visualize the search lattice across the full bounding box and inspect how collection progress is distributed geographically.
          </p>
        </div>
      </div>

      <article class="card">
        <div class="card-body grid-view__toolbar">
          <div class="field">
            <label for="grid-session">Session selector</label>
            <select id="grid-session" v-model="selectedSessionId" class="select">
              <option value="">Select a session</option>
              <option v-for="session in sessionsStore.list" :key="session.id" :value="String(session.id)">
                {{ session.query }} • {{ session.location }}
              </option>
            </select>
          </div>

          <div v-if="currentSession" class="grid-view__meta">
            <span class="badge badge--accent">
              {{ currentSession.cells_done || 0 }}/{{ currentSession.total_cells || 0 }} complete
            </span>
            <span class="badge badge--blue">{{ currentSession.total_places || 0 }} places</span>
            <span class="badge badge--gold">{{ currentSession.pages_fetched || 0 }} pages</span>
          </div>
        </div>
      </article>
    </section>

    <section v-if="selectedSessionId" class="page-section">
      <GridMap
        :cells="currentCells"
        :bbox="currentSession?.bbox"
        :active-cell-id="focusedCellId"
      />

      <div class="table-shell">
        <div class="table-scroll">
          <table class="table table--compact">
            <thead>
              <tr>
                <th>Cell #</th>
                <th>SW coords</th>
                <th>NE coords</th>
                <th>Status</th>
                <th>Places</th>
                <th>Pages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody v-if="loadingGrid">
              <tr v-for="row in 8" :key="row">
                <td colspan="7">
                  <div class="skeleton skeleton-row" />
                </td>
              </tr>
            </tbody>
            <tbody v-else-if="currentCells.length">
              <tr v-for="cell in currentCells" :key="cell.id">
                <td>#{{ cell.cell_index }}</td>
                <td>{{ cell.sw_lat }}, {{ cell.sw_lng }}</td>
                <td>{{ cell.ne_lat }}, {{ cell.ne_lng }}</td>
                <td>
                  <span :class="['badge', cell.status === 'done' ? 'badge--accent' : cell.status === 'fetching' ? 'badge--blue' : cell.status === 'exhausted' ? 'badge--gold' : '']">
                    {{ cell.status }}
                  </span>
                </td>
                <td>{{ cell.places_found || 0 }}</td>
                <td>{{ cell.pages_fetched || 0 }}</td>
                <td>
                  <button
                    type="button"
                    class="button button--ghost button--sm"
                    @click="focusedCellId = cell.id"
                  >
                    Focus
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7">
                  <EmptyState
                    title="No grid cells saved"
                    body="This session has not produced a grid response yet, or the backend returned an empty grid."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <EmptyState
      v-else
      title="Select a session"
      body="Choose a session above to render the bounding-box grid and inspect cell-level progress."
    />
  </div>
</template>

<style scoped>
.grid-view__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-4);
}

.grid-view__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
</style>
