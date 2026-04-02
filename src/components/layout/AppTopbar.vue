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

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: var(--topbar-h);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid rgba(39, 79, 97, 0.55);
  background: rgba(7, 18, 24, 0.88);
  backdrop-filter: blur(18px);
}

.topbar__left,
.topbar__right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.topbar__left h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.topbar__left p:last-child {
  margin: 0;
  color: var(--text-muted);
}

.topbar__menu {
  display: none;
}

.topbar__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(11, 24, 31, 0.88);
}

.topbar__meta strong,
.topbar__stat strong {
  display: block;
}

.topbar__meta p,
.topbar__stat span {
  margin: 0;
  color: var(--text-dim);
  font-size: 0.82rem;
}

.topbar__stat {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(11, 24, 31, 0.88);
}

@media (max-width: 1150px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .topbar__right {
    justify-content: space-between;
    flex-wrap: wrap;
  }
}

@media (max-width: 767px) {
  .topbar {
    padding: var(--space-4);
  }

  .topbar__menu {
    display: inline-flex;
  }

  .topbar__left {
    align-items: flex-start;
  }

  .topbar__left h2 {
    font-size: 1.5rem;
  }

  .topbar__right {
    gap: var(--space-3);
  }

  .topbar__meta,
  .topbar__stat {
    flex: 1 1 100%;
  }
}
</style>
