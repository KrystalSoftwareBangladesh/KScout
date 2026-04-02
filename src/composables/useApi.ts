type QueryValue = string | number | boolean | null | undefined

type RequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  query?: Record<string, QueryValue>
  baseUrl?: string
}

function normalizeError(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const errorBag = payload as Record<string, unknown>

  return (
    (typeof errorBag.error === 'string' && errorBag.error) ||
    (typeof errorBag.message === 'string' && errorBag.message) ||
    (typeof errorBag.detail === 'string' && errorBag.detail) ||
    fallback
  )
}

export function useApi() {
  const defaultBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

  const resolveUrl = (
    path: string,
    query: Record<string, QueryValue> = {},
    baseUrl = defaultBaseUrl,
  ) => {
    const origin =
      typeof window === 'undefined' ? 'http://localhost:5173' : window.location.origin

    const url = new URL(path, baseUrl || origin)

    Object.entries(query).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        return
      }

      url.searchParams.set(key, String(value))
    })

    return url.toString()
  }

  const request = async <T = any>(path: string, options: RequestOptions = {}) => {
    const { method = 'GET', body, headers = {}, query = {}, baseUrl } = options
    const hasJsonBody =
      body !== undefined && body !== null && !(body instanceof FormData) && typeof body !== 'string'

    const response = await fetch(resolveUrl(path, query, baseUrl), {
      method,
      headers: {
        Accept: 'application/json',
        ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body:
        body === undefined || body === null
          ? undefined
          : hasJsonBody
            ? JSON.stringify(body)
            : (body as BodyInit),
    })

    if (response.status === 204) {
      return null as T
    }

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const payload = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      throw new Error(normalizeError(payload, `Request failed with ${response.status}`))
    }

    return payload as T
  }

  return {
    defaultBaseUrl,
    request,
    resolveUrl,
  }
}
