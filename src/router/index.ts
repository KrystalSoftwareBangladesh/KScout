import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import SearchView from '@/views/SearchView.vue'
import ResultsView from '@/views/ResultsView.vue'
import GridView from '@/views/GridView.vue'
import RawDataView from '@/views/RawDataView.vue'
import SetupView from '@/views/SetupView.vue'
import ClientFinderPlaceholder from '@/views/_ClientFinderPlaceholder.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard',
        subtitle: 'Monitor coverage, quality, and collection momentum across every search session.',
      },
    },
    {
      path: '/search',
      alias: '/find-places',
      name: 'search',
      component: SearchView,
      meta: {
        title: 'Find Places',
        subtitle: 'Create grid-based collection sessions and advance Google Places coverage cell by cell.',
      },
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
      meta: {
        title: 'Results',
        subtitle: 'Filter, review, and export the businesses collected from your active sessions.',
      },
    },
    {
      path: '/grid',
      name: 'grid',
      component: GridView,
      meta: {
        title: 'Grid View',
        subtitle: 'Inspect scan progress geographically, cell by cell, without relying on an external map library.',
      },
    },
    {
      path: '/raw',
      name: 'raw',
      component: RawDataView,
      meta: {
        title: 'Raw Data',
        subtitle: 'Audit saved API payloads and request bodies for debugging or backend verification.',
      },
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupView,
      meta: {
        title: 'Setup',
        subtitle: 'Connect the Flask backend, validate health, and confirm the environment is ready to scan.',
      },
    },
    {
      path: '/client-finder',
      name: 'client-finder',
      component: ClientFinderPlaceholder,
      meta: {
        title: 'Client Finder',
        subtitle: 'Phase 2 placeholder for outreach, pipeline, and lead conversion workflows.',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
