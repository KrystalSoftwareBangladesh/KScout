export type EntityId = string | number

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]

export type JsonObject = {
  [key: string]: JsonValue
}

export type HealthPayload = Record<string, unknown> & {
  api_key_valid?: boolean
  google_api_key_valid?: boolean
  google_maps_configured?: boolean
  has_api_key?: boolean
}

export interface BoundingBox {
  sw_lat?: number | string | null
  sw_lng?: number | string | null
  ne_lat?: number | string | null
  ne_lng?: number | string | null
  [key: string]: unknown
}

export interface GridCell {
  id: EntityId
  cell_index?: number | string | null
  sw_lat?: number | string | null
  sw_lng?: number | string | null
  ne_lat?: number | string | null
  ne_lng?: number | string | null
  places_found?: number | string | null
  pages_fetched?: number | string | null
  status?: string | null
  [key: string]: unknown
}

export interface SessionItem {
  id: EntityId
  query: string
  location: string
  created_at?: string | null
  last_fetched_at?: string | null
  is_exhausted?: boolean
  total_cells?: number | string | null
  cells_done?: number | string | null
  total_places?: number | string | null
  pages_fetched?: number | string | null
  bbox?: BoundingBox | null
  [key: string]: unknown
}

export interface CollectionFetchResult {
  session?: SessionItem
  fetched?: number | string | null
  inserted?: number | string | null
  duplicates_skipped?: number | string | null
  cell_index?: number | string | null
  [key: string]: unknown
}

export interface LocationCount {
  location: string
  count: number
}

export interface TypeCount {
  type: string
  count: number
}

export interface SessionStats {
  total_places: number
  total_sessions: number
  avg_rating: number
  with_website: number
  with_phone: number
  with_rating: number
  top_locations: LocationCount[]
  top_types: TypeCount[]
}

export interface PlaceReview {
  author?: string | null
  rating?: number | string | null
  text?: string | null
  time?: number | string | null
  [key: string]: unknown
}

export interface PlaceItem {
  id: EntityId
  name?: string | null
  query?: string | null
  location?: string | null
  formatted_address?: string | null
  phone?: string | null
  website?: string | null
  rating?: number | string | null
  rating_count?: number | string | null
  business_status?: string | null
  is_open?: boolean | null
  google_maps_uri?: string | null
  types?: string[] | string | null
  reviews?: PlaceReview[] | null
  [key: string]: unknown
}

export interface PlaceFiltersState {
  minRating: number
  hasPhone: boolean
  hasWebsite: boolean
  isOpen: boolean
  status: string
}

export const createPlaceFilters = (): PlaceFiltersState => ({
  minRating: 0,
  hasPhone: false,
  hasWebsite: false,
  isOpen: false,
  status: '',
})

export interface PlacesResponse {
  places: PlaceItem[]
  total: number
  page: number
  per_page: number
}

export interface RawApiResponse {
  id: EntityId
  called_at?: string | null
  api_type?: string | null
  page_number?: number | string | null
  places_count?: number | string | null
  request_body?: JsonValue
  response_body?: JsonValue
  [key: string]: unknown
}

export interface RawResponsesPayload {
  responses: RawApiResponse[]
  total: number
}
