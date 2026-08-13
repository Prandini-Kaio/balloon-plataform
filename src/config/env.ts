export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  adminUrl: import.meta.env.VITE_ADMIN_URL ?? 'https://console.balloon.app.br',
  mercadoPagoPublicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY ?? '',
} as const
