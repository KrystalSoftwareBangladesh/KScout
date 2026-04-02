<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import RawResponseViewer from '@/components/ui/RawResponseViewer.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useApi } from '@/composables/useApi'
import { useSessionsStore } from '@/stores/sessions'
import { useToastStore } from '@/stores/toast'

const sessionsStore = useSessionsStore()
const toast = useToastStore()
const { request } = useApi()

const selectedSessionId = ref('')
const loading = ref(false)
const responses = ref<Array<Record<string, any>>>([])
const total = ref(0)
const page = ref(1)
const perPage = ref(10)
const activeResponse = ref<Record<string, any> | null>(null)

const loadResponses = async () => {
  if (!selectedSessionId.value) {
    responses.value = []
    total.value = 0
    return
  }

  loading.value = true

  try {
    const payload = await request<{
      responses: Array<Record<string, any>>
      total: number
    }>(`/api/sessions/${selectedSessionId.value}/raw`, {
      query: {
        page: page.value,
        per_page: perPage.value,
      },
    })

    responses.value = payload?.responses || []
    total.value = Number(payload?.total || 0)
  } catch (error) {
    toast.error('Unable to load raw data', (error as Error).message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!sessionsStore.list.length) {
    await sessionsStore.loadAll()
  }

  selectedSessionId.value = String(sessionsStore.list[0]?.id || '')
  await loadResponses()
})

watch(selectedSessionId, async () => {
  page.value = 1
  await loadResponses()
})
</script>

<template>
  <div class="page-shell">
    <section class="page-section">
      <div class="page-heading">
        <div>
          <h1>Raw Data</h1>
          <p>
            Inspect every saved API response, compare request bodies against the backend payloads, and verify what the collector stored.
          </p>
        </div>
      </div>

      <article class="card">
        <div class="card-body raw-data__toolbar">
          <div class="field">
            <label for="raw-session">Session selector</label>
            <select id="raw-session" v-model="selectedSessionId" class="select">
              <option value="">Select a session</option>
              <option v-for="session in sessionsStore.list" :key="session.id" :value="String(session.id)">
                {{ session.query }} • {{ session.location }}
              </option>
            </select>
          </div>

          <span class="badge badge--blue">{{ total }} saved responses</span>
        </div>
      </article>
    </section>

    <section v-if="selectedSessionId" class="page-section">
      <div class="table-shell">
        <div class="table-scroll">
          <table class="table table--compact">
            <thead>
              <tr>
                <th>Called At</th>
                <th>API Type</th>
                <th>Page</th>
                <th>Places Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody v-if="loading">
              <tr v-for="row in perPage" :key="row">
                <td colspan="5">
                  <div class="skeleton skeleton-row" />
                </td>
              </tr>
            </tbody>
            <tbody v-else-if="responses.length">
              <tr v-for="response in responses" :key="response.id">
                <td>{{ new Date(response.called_at).toLocaleString() }}</td>
                <td>{{ response.api_type }}</td>
                <td>{{ response.page_number || 1 }}</td>
                <td>{{ response.places_count || 0 }}</td>
                <td>
                  <button
                    type="button"
                    class="button button--ghost button--sm"
                    @click="activeResponse = response"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5">
                  <EmptyState
                    title="No raw responses found"
                    body="Once the backend saves request and response payloads, they will appear here for audit and debugging."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="toolbar">
        <div class="helper-row">
          <span class="badge badge--gold">Page {{ page }}</span>
          <span class="dim">10 responses per page</span>
        </div>
        <div class="toolbar__group">
          <button
            type="button"
            class="button button--ghost"
            :disabled="page <= 1 || loading"
            @click="
              page -= 1;
              loadResponses()
            "
          >
            Previous
          </button>
          <button
            type="button"
            class="button button--ghost"
            :disabled="page * perPage >= total || loading"
            @click="
              page += 1;
              loadResponses()
            "
          >
            Next
          </button>
        </div>
      </div>
    </section>

    <EmptyState
      v-else
      title="Select a session"
      body="Pick a session above to load its saved request and response payloads."
    />

    <RawResponseViewer
      :open="Boolean(activeResponse)"
      :response="activeResponse"
      @close="activeResponse = null"
    />
  </div>
</template>

<style scoped>
.raw-data__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-4);
}
</style>
