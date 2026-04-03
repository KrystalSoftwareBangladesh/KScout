<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const { request } = useApi()

const connectionUrl = ref('http://localhost:5000')
const testing = ref(false)
const connectionResult = ref<Record<string, any> | null>(null)
const connected = ref<boolean | null>(null)

const setupSteps = [
  {
    title: 'Get a Google Maps API key',
    body: 'Create or select a Google Cloud project and generate a key for Places API (New).',
    link: 'https://console.cloud.google.com/',
  },
  {
    title: 'Enable Places API (New)',
    body: 'Turn on the new Places API inside Google Cloud and confirm billing remains within the free tier.',
    link: 'https://console.cloud.google.com/apis/library',
  },
  {
    title: 'Configure the backend .env file',
    body: 'Set the API key and any backend environment variables required by your Flask service.',
    link: 'https://console.cloud.google.com/',
  },
  {
    title: 'Run the backend server',
    body: 'Start Flask on http://localhost:5000 so the Vite proxy can forward /api requests correctly.',
    link: 'http://localhost:5000/api/health',
  },
  {
    title: 'Run this frontend',
    body: 'Launch the Vite dev server, then test the health endpoint from the panel below.',
    link: '#/setup',
  },
]

const apiKeyState = computed(() => {
  const payload = connectionResult.value || {}

  if (
    payload.api_key_valid === true ||
    payload.google_api_key_valid === true ||
    payload.google_maps_configured === true
  ) {
    return 'Valid'
  }

  if (
    payload.api_key_valid === false ||
    payload.google_api_key_valid === false ||
    payload.google_maps_configured === false ||
    payload.has_api_key === false
  ) {
    return 'Missing or invalid'
  }

  return 'Not exposed by /api/health'
})

const healthEntries = computed(() =>
  Object.entries(connectionResult.value || {}).slice(0, 6),
)

const testConnection = async () => {
  testing.value = true

  try {
    const payload = await request('/api/health', {
      baseUrl: connectionUrl.value,
    })

    connectionResult.value = payload || {}
    connected.value = true
    toast.success('Connection successful', 'The backend health endpoint responded correctly.')
  } catch (error) {
    connected.value = false
    connectionResult.value = null
    toast.error('Connection failed', (error as Error).message)
  } finally {
    testing.value = false
  }
}
</script>

<template>
  <div class="page-shell">
    <section class="page-section">
      <div class="page-heading">
        <div>
          <h1>Setup</h1>
          <p>
            A guided checklist for backend readiness, Google Places activation, and live connectivity before collection begins.
          </p>
        </div>
      </div>

      <div class="setup__steps">
        <article v-for="(step, index) in setupSteps" :key="step.title" class="card">
          <div class="card-body setup__step-card">
            <span class="setup__step-index">{{ index + 1 }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.body }}</p>
            </div>
            <a class="button button--ghost button--sm" :href="step.link" target="_blank" rel="noopener noreferrer">
              Open
            </a>
          </div>
        </article>
      </div>
    </section>

    <section class="two-column">
      <article class="card">
        <div class="card-header">
          <div>
            <p class="eyebrow">Connection Tester</p>
            <h2>Backend health probe</h2>
          </div>
        </div>

        <div class="card-body page-section">
          <div class="field">
            <label for="backend-url">Backend URL</label>
            <input
              id="backend-url"
              v-model="connectionUrl"
              class="input"
              type="url"
              placeholder="http://localhost:5000"
            />
          </div>

          <div class="helper-row">
            <button type="button" class="button" :disabled="testing" @click="testConnection">
              {{ testing ? 'Testing...' : 'Test Connection' }}
            </button>
            <span
              v-if="connected !== null"
              :class="['badge', connected ? 'badge--accent' : 'badge--danger']"
            >
              {{ connected ? 'Connected' : 'Failed' }}
            </span>
            <span class="badge badge--blue">API key: {{ apiKeyState }}</span>
          </div>

          <div class="setup__health card card--inset">
            <div class="card-body">
              <div v-if="healthEntries.length" class="setup__health-grid">
                <div v-for="[key, value] in healthEntries" :key="key">
                  <span>{{ key }}</span>
                  <strong>{{ String(value) }}</strong>
                </div>
              </div>
              <div v-else class="dim">Run the connection test to inspect the live health payload.</div>
            </div>
          </div>
        </div>
      </article>

      <article class="card">
        <div class="card-header">
          <div>
            <p class="eyebrow">Free Tier View</p>
            <h2>Usage vs cost</h2>
          </div>
        </div>

        <div class="card-body">
          <div class="table-shell">
            <div class="table-scroll">
              <table class="table table--compact">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Usage</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nominatim geocoding</td>
                    <td>Session setup</td>
                    <td>$0.00</td>
                  </tr>
                  <tr>
                    <td>Grid progress UI</td>
                    <td>Unlimited in frontend</td>
                    <td>$0.00</td>
                  </tr>
                  <tr>
                    <td>CSV / JSON export</td>
                    <td>On demand</td>
                    <td>$0.00</td>
                  </tr>
                  <tr>
                    <td>Raw response viewer</td>
                    <td>Power-user debugging</td>
                    <td>$0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
