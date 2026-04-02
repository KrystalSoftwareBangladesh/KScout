<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionsStore } from '@/stores/sessions'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const router = useRouter()
const sessionsStore = useSessionsStore()

const platformItems = [
  { label: 'Dashboard', icon: '⚡', to: '/' },
  { label: 'Find Places', icon: '🔍', to: '/search' },
  { label: 'Results', icon: '📊', to: '/results' },
  { label: 'Grid View', icon: '🗺', to: '/grid' },
  { label: 'Raw Data', icon: '🗄', to: '/raw' },
  { label: 'Setup', icon: '⚙️', to: '/setup' },
]

const comingSoonItems = [
  { label: 'Find Clients', icon: '🎯' },
  { label: 'Campaigns', icon: '📣' },
  { label: 'Pipeline', icon: '📈' },
]

const visibleSessions = computed(() => sessionsStore.list.slice(0, 8))

const isSessionActive = (sessionId: string | number) =>
  route.path === '/search' && String(route.query.session || '') === String(sessionId)

const openSession = (sessionId: string | number) => {
  router.push({
    path: '/search',
    query: {
      session: String(sessionId),
    },
  })
  emit('close')
}

const progressWidth = (session: Record<string, any>) => {
  const total = Number(session.total_cells || 0)
  const done = Number(session.cells_done || 0)

  if (!total) {
    return '0%'
  }

  return `${Math.min((done / total) * 100, 100)}%`
}
</script>

<template>
  <aside :class="['sidebar', { 'sidebar--open': open }]">
    <div class="sidebar__header">
      <div class="sidebar__brand">
        <div class="sidebar__logo">▣</div>
        <div>
          <h1>ShopFinder</h1>
          <p>Business Intelligence Platform</p>
        </div>
      </div>
    </div>

    <div class="sidebar__content">
      <section class="sidebar__section">
        <header class="sidebar__section-head">Platform</header>

        <nav class="sidebar__nav">
          <RouterLink
            v-for="item in platformItems"
            :key="item.to"
            :to="item.to"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': route.path === item.to }"
            @click="emit('close')"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
      </section>

      <section class="sidebar__section sidebar__section--muted">
        <header class="sidebar__section-head">
          <span>Coming Soon</span>
          <span class="badge badge--gold">🔒 Soon</span>
        </header>

        <div class="sidebar__nav sidebar__nav--disabled">
          <div
            v-for="item in comingSoonItems"
            :key="item.label"
            class="sidebar__link sidebar__link--disabled"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </section>

      <section class="sidebar__section sidebar__sessions">
        <header class="sidebar__section-head">
          <span>Live Sessions</span>
          <span class="badge badge--accent">{{ sessionsStore.activeSessions.length }} active</span>
        </header>

        <div v-if="sessionsStore.loading && !sessionsStore.list.length" class="sidebar__session-list">
          <div
            v-for="index in 4"
            :key="index"
            class="sidebar__session skeleton"
          />
        </div>

        <div v-else-if="visibleSessions.length" class="sidebar__session-list">
          <button
            v-for="session in visibleSessions"
            :key="session.id"
            type="button"
            class="sidebar__session"
            :class="{ 'sidebar__session--active': isSessionActive(session.id) }"
            @click="openSession(session.id)"
          >
            <div class="sidebar__session-top">
              <strong>{{ session.query }}</strong>
              <span :class="['badge', session.is_exhausted ? 'badge--gold' : 'badge--accent']">
                {{ session.is_exhausted ? 'Exhausted' : 'Active' }}
              </span>
            </div>
            <p>{{ session.location }}</p>
            <div class="progress">
              <span :style="{ width: progressWidth(session) }" />
            </div>
            <div class="sidebar__session-meta">
              <span>{{ session.cells_done || 0 }}/{{ session.total_cells || 0 }} cells</span>
              <span>{{ session.total_places || 0 }} places</span>
            </div>
          </button>
        </div>

        <div v-else class="sidebar__empty">
          <p>No sessions yet. Start a scan from Find Places.</p>
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid var(--border);
  background: rgba(6, 16, 22, 0.92);
  backdrop-filter: blur(18px);
}

.sidebar__header {
  padding: var(--space-5);
  border-bottom: 1px solid rgba(39, 79, 97, 0.55);
}

.sidebar__brand {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.sidebar__logo {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(34, 224, 194, 0.32);
  border-radius: 16px;
  background: radial-gradient(circle at top, rgba(34, 224, 194, 0.2), rgba(11, 29, 34, 0.9));
  color: var(--accent);
  font-size: 1.3rem;
  box-shadow: var(--shadow-accent);
}

.sidebar__brand h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar__brand p {
  margin: 0;
  color: var(--text-dim);
  font-size: 0.88rem;
}

.sidebar__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-5);
  overflow-y: auto;
}

.sidebar__section {
  display: grid;
  gap: var(--space-3);
}

.sidebar__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--text-muted);
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.sidebar__section--muted {
  opacity: 0.72;
}

.sidebar__nav {
  display: grid;
  gap: var(--space-2);
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 46px;
  padding: 0 var(--space-4);
  border: 1px solid transparent;
  border-radius: 16px;
  color: var(--text-muted);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.sidebar__link:hover {
  border-color: var(--border2);
  background: rgba(16, 34, 45, 0.72);
  color: var(--text);
  transform: translateX(2px);
}

.sidebar__link--active {
  border-color: rgba(34, 224, 194, 0.3);
  background: rgba(17, 50, 57, 0.92);
  color: var(--accent);
}

.sidebar__link--disabled {
  cursor: not-allowed;
}

.sidebar__sessions {
  margin-top: auto;
}

.sidebar__session-list {
  display: grid;
  gap: var(--space-3);
}

.sidebar__session {
  display: grid;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(13, 28, 36, 0.94);
  color: var(--text);
  text-align: left;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
}

.sidebar__session:hover {
  border-color: var(--border2);
  transform: translateY(-1px);
}

.sidebar__session--active {
  border-color: rgba(34, 224, 194, 0.34);
  background: rgba(17, 50, 57, 0.84);
}

.sidebar__session-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.sidebar__session strong {
  display: block;
  font-size: 0.98rem;
}

.sidebar__session p {
  margin: 0;
  color: var(--text-dim);
  font-size: 0.88rem;
}

.sidebar__session-meta {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--text-dim);
  font-size: 0.8rem;
}

.sidebar__empty {
  padding: var(--space-4);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  color: var(--text-dim);
}

@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(84vw, 340px);
    transform: translateX(-100%);
    transition: transform 0.24s ease;
    box-shadow: 0 22px 70px rgba(0, 0, 0, 0.45);
  }

  .sidebar--open {
    transform: translateX(0);
  }
}
</style>
