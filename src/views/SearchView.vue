<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import SessionCard from '@/components/ui/SessionCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useSessionsStore } from '@/stores/sessions'
import type { CollectionFetchResult } from '@/types/domain'

const route = useRoute()
const sessionsStore = useSessionsStore()

const createForm = reactive({
  query: '',
  location: '',
  cellSize: 1,
})

const creating = ref(false)
const createStatus = ref('')
const lastResults = ref<Record<string, CollectionFetchResult>>({})

const cellOptions = [
  {
    value: 1,
    label: 'Country 1.0°',
    helper: 'Typical scan: 20–120 cells • theoretical cap around 1,200–7,200 results',
  },
  {
    value: 0.5,
    label: 'Region 0.5°',
    helper: 'Typical scan: 24–96 cells • theoretical cap around 1,440–5,760 results',
  },
  {
    value: 0.25,
    label: 'City 0.25°',
    helper: 'Typical scan: 8–36 cells • theoretical cap around 480–2,160 results',
  },
]

const sessionCards = computed(() => sessionsStore.list)
const selectedSessionId = computed(() => String(route.query.session || ''))
const selectedCellOption = computed(
  () => cellOptions.find((option) => option.value === Number(createForm.cellSize)) ?? cellOptions[0]!,
)

const createSession = async () => {
  if (!createForm.query.trim() || !createForm.location.trim()) {
    return
  }

  creating.value = true
  const messages = [
    `Locating ${createForm.location.trim()}...`,
    `Generating ${selectedCellOption.value.label.toLowerCase()} grid...`,
    `Preparing collection session...`,
  ]
  let index = 0
  createStatus.value = messages[index] || 'Preparing collection session...'

  const timer = window.setInterval(() => {
    index = (index + 1) % messages.length
    createStatus.value = messages[index] || 'Preparing collection session...'
  }, 1100)

  try {
    const session = await sessionsStore.create(
      createForm.query.trim(),
      createForm.location.trim(),
      Number(createForm.cellSize),
    )

    createForm.query = ''
    createForm.location = ''
    createStatus.value = `Session #${session.id} ready.`
  } catch {
    createStatus.value = 'Session creation failed.'
  } finally {
    window.clearInterval(timer)
    creating.value = false
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
})
</script>

<template>
  <div class="page-shell">
    <section class="page-section">
      <div class="page-heading">
        <div>
          <h1>Find Places</h1>
          <p>
            Define a niche, geocode the territory, generate a bounding-box grid, and advance the search systematically across every cell.
          </p>
        </div>
      </div>

      <article class="card search-form">
        <div class="card-header">
          <div>
            <p class="eyebrow">Create Session</p>
            <h2>Start a new collection run</h2>
          </div>
          <span class="badge badge--accent">Phase 1 primary action</span>
        </div>

        <form class="card-body field-grid search-form__grid" @submit.prevent="createSession">
          <div class="field">
            <label for="query">Business niche</label>
            <input
              id="query"
              v-model="createForm.query"
              class="input"
              type="text"
              placeholder="hijab shop"
            />
          </div>

          <div class="field">
            <label for="location">Location</label>
            <input
              id="location"
              v-model="createForm.location"
              class="input"
              type="text"
              placeholder="Bangladesh"
            />
          </div>

          <div class="field">
            <label for="cell-size">Grid cell size</label>
            <select id="cell-size" v-model="createForm.cellSize" class="select">
              <option v-for="option in cellOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <span class="field-help">{{ selectedCellOption.helper }}</span>
          </div>

          <div class="search-form__actions">
            <button type="submit" class="button" :disabled="creating">
              {{ creating ? 'Creating...' : 'Create Session' }}
            </button>
            <span v-if="createStatus" class="badge badge--blue">{{ createStatus }}</span>
          </div>
        </form>
      </article>
    </section>

    <section class="page-section">
      <div class="page-heading">
        <div>
          <h2>Session Queue</h2>
          <p>Active and historical scans, ready for manual advancement and auditing.</p>
        </div>
      </div>

      <div v-if="sessionsStore.loading && !sessionCards.length" class="search-view__skeletons">
        <div v-for="row in 3" :key="row" class="skeleton skeleton-card" />
      </div>

      <div v-else-if="sessionCards.length" class="stagger-list search-view__cards">
        <div
          v-for="session in sessionCards"
          :key="session.id"
          :class="['search-view__card-wrap', { 'search-view__card-wrap--selected': selectedSessionId === String(session.id) }]"
        >
          <SessionCard
            :session="session"
            :is-fetching="sessionsStore.fetching === session.id"
            :last-result="lastResults[String(session.id)]"
            @fetch="fetchNext"
            @delete="removeSession"
          />
        </div>
      </div>

      <EmptyState
        v-else
        title="No sessions yet"
        body="Create a place-finding session above to start scanning a location cell by cell."
      />
    </section>
  </div>
</template>
