const SDK_SRC = 'https://sdk.mercadopago.com/js/v2'

type MpBricksBuilder = {
  create: (
    brick: 'payment',
    containerId: string,
    settings: Record<string, unknown>,
  ) => Promise<{ unmount: () => void }>
}

type MercadoPagoCtor = new (
  publicKey: string,
  options?: { locale: string },
) => {
  bricks: () => MpBricksBuilder
}

declare global {
  interface Window {
    MercadoPago?: MercadoPagoCtor
  }
}

let loading: Promise<void> | null = null

export function loadMercadoPagoSdk(): Promise<void> {
  if (window.MercadoPago) return Promise.resolve()
  if (loading) return loading

  loading = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar Mercado Pago')))
      return
    }

    const script = document.createElement('script')
    script.src = SDK_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      loading = null
      reject(new Error('Falha ao carregar Mercado Pago'))
    }
    document.head.appendChild(script)
  })

  return loading
}

export function reaisFromCentavos(centavos: number): number {
  return Math.round(centavos) / 100
}

export function encodeCheckoutPayload(data: unknown): string {
  const json = JSON.stringify(data)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
