import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'
import {
  createPlaceFilters,
  type PlaceFiltersState,
  type PlaceItem,
  type PlacesResponse,
} from '@/types/domain'

function triggerDownload(url: string) {
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const usePlacesStore = defineStore('places', {
  state: () => ({
    items: [] as PlaceItem[],
    total: 0,
    page: 1,
    perPage: 12,
    search: '',
    sessionId: '',
    filters: createPlaceFilters() as PlaceFiltersState,
    loading: false,
  }),

  getters: {
    totalPages: (state) => Math.max(Math.ceil(state.total / state.perPage), 1),
    startNum: (state) => (state.total === 0 ? 0 : (state.page - 1) * state.perPage + 1),
    endNum: (state) => Math.min(state.page * state.perPage, state.total),
  },

  actions: {
    async load(page?: number) {
      const { request } = useApi()
      const toast = useToastStore()
      const nextPage = page ?? this.page
      this.loading = true
      this.page = nextPage

      try {
        const payload = await request<PlacesResponse>('/api/places', {
          query: {
            session_id: this.sessionId || undefined,
            search: this.search || undefined,
            page: this.page,
            per_page: this.perPage,
            min_rating: this.filters.minRating || undefined,
            has_phone: this.filters.hasPhone || undefined,
            has_website: this.filters.hasWebsite || undefined,
            is_open: this.filters.isOpen || undefined,
            status: this.filters.status || undefined,
          },
        })

        this.items = Array.isArray(payload?.places) ? payload.places : []
        this.total = Number(payload?.total || 0)
        this.page = Number(payload?.page || this.page)
        this.perPage = Number(payload?.per_page || this.perPage)
      } catch (error) {
        toast.error('Unable to load places', (error as Error).message)
      } finally {
        this.loading = false
      }
    },

    async applyFilters() {
      this.page = 1
      await this.load(1)
    },

    exportCSV() {
      const { resolveUrl } = useApi()
      const toast = useToastStore()

      try {
        triggerDownload(
          resolveUrl('/api/export/csv', {
            session_id: this.sessionId || undefined,
          }),
        )
        toast.info('CSV export started', 'Your export opened in a new tab.')
      } catch (error) {
        toast.error('CSV export failed', (error as Error).message)
      }
    },

    exportJSON() {
      const { resolveUrl } = useApi()
      const toast = useToastStore()

      try {
        triggerDownload(
          resolveUrl('/api/export/json', {
            session_id: this.sessionId || undefined,
          }),
        )
        toast.info('JSON export started', 'Your export opened in a new tab.')
      } catch (error) {
        toast.error('JSON export failed', (error as Error).message)
      }
    },

    resetFilters() {
      this.filters = createPlaceFilters()
    },
  },
})
