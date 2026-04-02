import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { useToastStore } from '@/stores/toast'

type SessionItem = Record<string, any>
type StatsPayload = Record<string, any>
type GridCell = Record<string, any>

const emptyStats = () => ({
  total_places: 0,
  total_sessions: 0,
  avg_rating: 0,
  with_website: 0,
  with_phone: 0,
  with_rating: 0,
  top_locations: [] as Array<{ location: string; count: number }>,
  top_types: [] as Array<{ type: string; count: number }>,
})

function sortSessions(list: SessionItem[]) {
  return [...list].sort((left, right) => {
    const leftDate = new Date(left.created_at || 0).getTime()
    const rightDate = new Date(right.created_at || 0).getTime()
    return rightDate - leftDate
  })
}

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    list: [] as SessionItem[],
    stats: emptyStats() as StatsPayload,
    loading: false,
    fetching: null as number | string | null,
    grids: {} as Record<string, GridCell[]>,
  }),

  getters: {
    activeSessions: (state) => state.list.filter((session) => !session.is_exhausted),
    exhaustedSessions: (state) => state.list.filter((session) => session.is_exhausted),
    byId: (state) => (id: string | number) =>
      state.list.find((session) => String(session.id) === String(id)) || null,
  },

  actions: {
    upsertSession(session: SessionItem) {
      const index = this.list.findIndex((item) => String(item.id) === String(session.id))

      if (index === -1) {
        this.list.unshift(session)
      } else {
        this.list.splice(index, 1, session)
      }

      this.list = sortSessions(this.list)
    },

    async loadAll() {
      const { request } = useApi()
      const toast = useToastStore()
      this.loading = true

      try {
        const [sessions, stats] = await Promise.all([
          request<SessionItem[]>('/api/sessions'),
          request<StatsPayload>('/api/stats'),
        ])

        this.list = sortSessions(Array.isArray(sessions) ? sessions : [])
        this.stats = {
          ...emptyStats(),
          ...(stats || {}),
        }
      } catch (error) {
        toast.error('Unable to load workspace', (error as Error).message)
      } finally {
        this.loading = false
      }
    },

    async create(query: string, location: string, cellSize: number) {
      const { request } = useApi()
      const toast = useToastStore()

      try {
        const session = await request<SessionItem>('/api/sessions', {
          method: 'POST',
          body: {
            query,
            location,
            cell_size: cellSize,
          },
        })

        this.upsertSession(session)
        await this.loadAll()
        toast.success('Session created', `${query} in ${location} is ready for collection.`)

        return session
      } catch (error) {
        toast.error('Session creation failed', (error as Error).message)
        throw error
      }
    },

    async fetchNext(id: string | number) {
      const { request } = useApi()
      const toast = useToastStore()
      this.fetching = id

      try {
        const result = await request<Record<string, any>>(`/api/sessions/${id}/fetch`, {
          method: 'POST',
        })

        if (result?.session) {
          this.upsertSession(result.session)
        }

        await this.loadAll()

        toast.success(
          'Collection advanced',
          `Cell ${result?.cell_index ?? '-'} fetched with ${result?.inserted ?? 0} new places saved.`,
        )

        return result
      } catch (error) {
        toast.error('Fetch failed', (error as Error).message)
        throw error
      } finally {
        this.fetching = null
      }
    },

    async remove(id: string | number) {
      const { request } = useApi()
      const toast = useToastStore()

      try {
        await request(`/api/sessions/${id}`, {
          method: 'DELETE',
        })

        this.list = this.list.filter((session) => String(session.id) !== String(id))
        delete this.grids[String(id)]
        await this.loadAll()
        toast.info('Session deleted', `Session ${id} and related data were removed.`)
      } catch (error) {
        toast.error('Delete failed', (error as Error).message)
        throw error
      }
    },

    async loadGrid(id: string | number) {
      const { request } = useApi()
      const toast = useToastStore()

      try {
        const cells = await request<GridCell[]>(`/api/sessions/${id}/grid`)
        this.grids[String(id)] = Array.isArray(cells) ? cells : []
        return this.grids[String(id)]
      } catch (error) {
        toast.error('Grid load failed', (error as Error).message)
        throw error
      }
    },
  },
})
