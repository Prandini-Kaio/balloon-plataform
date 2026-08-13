/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ADMIN_URL: string
  readonly VITE_MERCADOPAGO_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
