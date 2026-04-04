<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PlaceFilters from '@/components/ui/PlaceFilters.vue'
import PlaceRow from '@/components/ui/PlaceRow.vue'
import ReviewsModal from '@/components/ui/ReviewsModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { usePlacesStore } from '@/stores/places'
import { useSessionsStore } from '@/stores/sessions'
import type { PlaceFiltersState, PlaceItem } from '@/types/domain'

const route = useRoute()
const placesStore = usePlacesStore()
const sessionsStore = useSessionsStore()

const filtersOpen = ref(false)
const reviewPlace = ref<PlaceItem | null>(null)
let searchDebounce = 0

const syncSessionFromRoute = () => {
  const nextId = String(route.query.session || '')

  if (placesStore.sessionId !== nextId) {
    placesStore.sessionId = nextId
  }
}

const onSearchInput = () => {
  window.clearTimeout(searchDebounce)
  searchDebounce = window.setTimeout(() => {
    placesStore.applyFilters()
  }, 300)
}

const onSessionChange = async () => {
  await placesStore.applyFilters()
}

const onFiltersChange = async (value: PlaceFiltersState) => {
  placesStore.filters = {
    ...placesStore.filters,
    ...value,
  }
  await placesStore.applyFilters()
}

onMounted(async () => {
  if (!sessionsStore.list.length) {
    await sessionsStore.loadAll()
  }

  syncSessionFromRoute()
  await placesStore.load(placesStore.page)
})

watch(
  () => route.query.session,
  async () => {
    syncSessionFromRoute()
    await placesStore.applyFilters()
  },
)
</script>

<template>
  <div class="page-shell">
    <section class="page-section">
      <div class="page-heading">
        <div>
          <h1>Results</h1>
          <p>
            Search, filter, and export the businesses discovered by your grid-based sessions without losing the underlying collection context.
          </p>
        </div>
      </div>

      <article class="card">
        <div class="card-body page-section">
          <div class="toolbar">
            <div class="toolbar__group results__toolbar-main">
              <input
                v-model="placesStore.search"
                class="input results__search"
                type="search"
                placeholder="Search by business name or address"
                @input="onSearchInput"
              />

              <select
                v-model="placesStore.sessionId"
                class="select results__session-select"
                @change="onSessionChange"
              >
                <option value="">All sessions</option>
                <option v-for="session in sessionsStore.list" :key="session.id" :value="String(session.id)">
                  {{ session.query }} • {{ session.location }}
                </option>
              </select>
            </div>

            <div class="toolbar__group">
              <button type="button" class="button button--ghost" @click="filtersOpen = !filtersOpen">
                {{ filtersOpen ? 'Hide Filters' : 'Show Filters' }}
              </button>
              <button type="button" class="button button--soft" @click="placesStore.exportCSV()">
                CSV export
              </button>
              <button type="button" class="button button--soft" @click="placesStore.exportJSON()">
                JSON export
              </button>
            </div>
          </div>

          <PlaceFilters
            :open="filtersOpen"
            :model-value="placesStore.filters"
            @update:model-value="onFiltersChange"
          />
        </div>
      </article>
    </section>

    <section class="page-section">
      <div class="table-shell">
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name + types</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Website</th>
                <th>Rating + count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody v-if="placesStore.loading">
              <tr v-for="row in placesStore.perPage" :key="row">
                <td colspan="8">
                  <div class="skeleton skeleton-row" />
                </td>
              </tr>
            </tbody>
            <tbody v-else-if="placesStore.items.length">
              <PlaceRow
                v-for="(place, index) in placesStore.items"
                :key="place.id"
                :place="place"
                :index="placesStore.startNum + index"
                @reviews="reviewPlace = $event"
              />
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="8">
                  <EmptyState
                    title="No places match this filter set"
                    body="Try adjusting the session scope, rating threshold, or availability filters."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="toolbar">
        <div class="helper-row">
          <span class="badge badge--blue">
            Showing {{ placesStore.startNum }}–{{ placesStore.endNum }} of {{ placesStore.total }}
          </span>
          <span class="dim">Page {{ placesStore.page }} of {{ placesStore.totalPages }}</span>
        </div>

        <div class="toolbar__group">
          <button
            type="button"
            class="button button--ghost"
            :disabled="placesStore.page <= 1 || placesStore.loading"
            @click="placesStore.load(placesStore.page - 1)"
          >
            Previous
          </button>
          <button
            type="button"
            class="button button--ghost"
            :disabled="placesStore.page >= placesStore.totalPages || placesStore.loading"
            @click="placesStore.load(placesStore.page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </section>

    <ReviewsModal
      :open="Boolean(reviewPlace)"
      :place="reviewPlace"
      @close="reviewPlace = null"
    />
  </div>
</template>
