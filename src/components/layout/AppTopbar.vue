<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useSessionsStore } from '@/stores/sessions'

const emit = defineEmits<{
  toggleSidebar: []
}>()

const route = useRoute()
const sessionsStore = useSessionsStore()
const { request, defaultBaseUrl } = useApi()

const connected = ref(false)
const lastCheckedAt = ref('')
const statusLabel = ref('Checking')
let intervalId = 0

const title = computed(() => String(route.meta.title || 'ShopFinder'))
const subtitle = computed(() => String(route.meta.subtitle || 'Business intelligence workspace'))
const endpointLabel = computed(() => (defaultBaseUrl || 'http://localhost:5000 (via proxy)'))

const refreshHealth = async () => {
  try {
    await request('/api/health')
    connected.value = true
    statusLabel.value = 'Connected'
    lastCheckedAt.value = new Date().toLocaleTimeString()
  } catch {
    connected.value = false
    statusLabel.value = 'Offline'
    lastCheckedAt.value = new Date().toLocaleTimeString()
  }
}

onMounted(() => {
  refreshHealth()
  intervalId = window.setInterval(refreshHealth, 30000)
})

onBeforeUnmount(() => {
  window.clearInterval(intervalId)
})
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <button
        type="button"
        class="topbar__menu button button--ghost button--sm"
        @click="emit('toggleSidebar')"
      >
        ☰
      </button>

      <div>
        <p class="eyebrow">Phase 1 • Place Finder</p>
        <h2>{{ title }}</h2>
        <p>{{ subtitle }}</p>
      </div>
    </div>

    <div class="topbar__right">
      <div class="topbar__meta">
        <span :class="['status-dot', connected ? 'status-dot--connected' : 'status-dot--offline']" />
        <div>
          <strong>{{ statusLabel }}</strong>
          <p>{{ endpointLabel }} • {{ lastCheckedAt || 'waiting' }}</p>
        </div>
      </div>

      <div class="topbar__stat">
        <strong>{{ sessionsStore.activeSessions.length }}</strong>
        <span>active sessions</span>
      </div>

      <div class="topbar__stat">
        <strong>{{ sessionsStore.stats.total_places || 0 }}</strong>
        <span>businesses stored</span>
      </div>
    </div>
  </header>
</template>
