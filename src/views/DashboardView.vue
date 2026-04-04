<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import StatCard from '@/components/ui/StatCard.vue'
import SessionCard from '@/components/ui/SessionCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useApi } from '@/composables/useApi'
import { useSessionsStore } from '@/stores/sessions'
import { useToastStore } from '@/stores/toast'
import type {
  CollectionFetchResult,
  PlaceItem,
  PlacesResponse,
} from '@/types/domain'

const sessionsStore = useSessionsStore()
const toast = useToastStore()
const { request } = useApi()
const recentPlaces = ref<PlaceItem[]>([])
const loadingRecent = ref(false)
const lastResults = ref<Record<string, CollectionFetchResult>>({})

const statCards = computed(() => [
  {
    label: 'Total Businesses',
    value: Number(sessionsStore.stats.total_places || 0),
    icon: '▣',
    hint: 'All places collected so far',
    tone: 'accent' as const,
  },
  {
    label: 'Active Sessions',
    value: Number(sessionsStore.activeSessions.length),
    icon: '↻',
    hint: 'Sessions still scanning',
    tone: 'blue' as const,
  },
  {
    label: 'Avg Rating',
    value: Number(sessionsStore.stats.avg_rating || 0),
    icon: '★',
    hint: 'Average rating across saved places',
    tone: 'gold' as const,
    decimals: 1,
  },
  {
    label: 'Have Phone',
    value: Number(sessionsStore.stats.with_phone || 0),
    icon: '☎',
    hint: 'Businesses with phone numbers',
    tone: 'accent' as const,
  },
  {
    label: 'Have Website',
    value: Number(sessionsStore.stats.with_website || 0),
    icon: '⌘',
    hint: 'Businesses with websites',
    tone: 'blue' as const,
  },
  {
    label: 'Have Rating',
    value: Number(sessionsStore.stats.with_rating || 0),
    icon: '◌',
    hint: 'Businesses with rating data',
    tone: 'gold' as const,
  },
])

const recentSessions = computed(() => sessionsStore.list.slice(0, 4))
const topLocations = computed(() => sessionsStore.stats.top_locations || [])
const topTypes = computed(() => sessionsStore.stats.top_types || [])

const maxLocationCount = computed(() =>
  Math.max(...topLocations.value.map((item) => Number(item.count || 0)), 1),
)

const loadRecentPlaces = async () => {
  loadingRecent.value = true

  try {
    const payload = await request<PlacesResponse>('/api/places', {
      query: {
        page: 1,
        per_page: 8,
      },
    })

    recentPlaces.value = payload?.places || []
  } catch (error) {
    toast.error('Unable to load recent businesses', (error as Error).message)
  } finally {
    loadingRecent.value = false
  }
}

const fetchNext = async (id: string | number) => {
  try {
    const result = await sessionsStore.fetchNext(id)
    lastResults.value = {
      ...lastResults.value,
      [String(id)]: result,
    }
  } catch {
    // Store action already surfaced the error via toast.
  }
}

const removeSession = async (id: string | number) => {
  try {
    await sessionsStore.remove(id)
  } catch {
    // Store action already surfaced the error via toast.
  }
}

onMounted(async () => {
  if (!sessionsStore.list.length) {
    await sessionsStore.loadAll()
  }

  await loadRecentPlaces()
})
</script>

<template>
  <div class="page-shell">
    <section class="page-section">
      <div class="page-heading">
        <div>
          <h1>Operational Snapshot</h1>
          <p>
            A high-density view of collection health, quality signals, and the latest businesses entering the workspace.
          </p>
        </div>
      </div>

      <div class="stats-grid">
        <StatCard
          v-for="card in statCards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :icon="card.icon"
          :hint="card.hint"
          :tone="card.tone"
          :decimals="card.decimals || 0"
          :loading="sessionsStore.loading"
        />
      </div>
    </section>

    <section class="two-column">
      <div class="page-section">
        <div class="page-heading">
          <div>
            <h2>Latest Sessions</h2>
            <p>Recent collection runs with progress at the grid-cell level.</p>
          </div>
        </div>

        <div v-if="recentSessions.length" class="stagger-list dashboard__stack">
          <SessionCard
            v-for="session in recentSessions"
            :key="session.id"
            :session="session"
            :is-fetching="sessionsStore.fetching === session.id"
            :last-result="lastResults[String(session.id)]"
            @fetch="fetchNext"
            @delete="removeSession"
          />
        </div>

        <EmptyState
          v-else
          title="No sessions yet"
          body="Create your first place-finding session to start building the business dataset."
          action-label="Go to Find Places"
          @action="$router.push('/search')"
        />
      </div>

      <div class="page-section">
        <article class="card">
          <div class="card-header">
            <div>
              <p class="eyebrow">Top Locations</p>
              <h3>Highest-volume search areas</h3>
            </div>
          </div>
          <div class="card-body dashboard__bars">
            <div
              v-for="location in topLocations"
              :key="location.location"
              class="dashboard__bar-row"
            >
              <div class="dashboard__bar-head">
                <strong>{{ location.location }}</strong>
                <span>{{ location.count }}</span>
              </div>
              <div class="dashboard__bar-track">
                <span
                  class="dashboard__bar-fill"
                  :style="{ width: `${(Number(location.count || 0) / maxLocationCount) * 100}%` }"
                />
              </div>
            </div>
            <div v-if="!topLocations.length" class="dim">Location rankings will populate after sessions are saved.</div>
          </div>
        </article>

        <article class="card">
          <div class="card-header">
            <div>
              <p class="eyebrow">Top Business Types</p>
              <h3>Most common classifications</h3>
            </div>
          </div>
          <div class="card-body dashboard__types">
            <div
              v-for="item in topTypes"
              :key="item.type"
              class="dashboard__type-row"
            >
              <strong>{{ item.type }}</strong>
              <span class="badge badge--blue">{{ item.count }}</span>
            </div>
            <div v-if="!topTypes.length" class="dim">Type distribution becomes available after data collection starts.</div>
          </div>
        </article>
      </div>
    </section>

    <section class="page-section">
      <div class="page-heading">
        <div>
          <h2>Recent Businesses</h2>
          <p>The newest saved business records across all sessions.</p>
        </div>
      </div>

      <div class="table-shell">
        <div class="table-scroll">
          <table class="table table--compact">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Phone</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody v-if="loadingRecent">
              <tr v-for="row in 8" :key="row">
                <td colspan="5">
                  <div class="skeleton skeleton-row" />
                </td>
              </tr>
            </tbody>
            <tbody v-else-if="recentPlaces.length">
              <tr v-for="place in recentPlaces" :key="place.id">
                <td>
                  <strong>{{ place.name }}</strong>
                  <div class="dim">{{ place.query }} • {{ place.location }}</div>
                </td>
                <td>{{ place.formatted_address || 'No address' }}</td>
                <td>{{ place.rating ?? '—' }}</td>
                <td>{{ place.phone || '—' }}</td>
                <td>{{ place.website ? 'Available' : '—' }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5">
                  <EmptyState
                    title="No places collected"
                    body="Once sessions start fetching, recent businesses will appear here automatically."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
