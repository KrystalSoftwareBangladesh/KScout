/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PROXY_TARGET: string
  readonly VITE_APP_ENV: 'development' | 'stage' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
