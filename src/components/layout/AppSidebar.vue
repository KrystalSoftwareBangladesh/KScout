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
