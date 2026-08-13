import { httpClient } from '@/core/api/httpClient'
import { encodeCheckoutPayload } from './mercadopago'
import type { CheckoutInput, CheckoutResponse, CheckoutStatusResponse } from './types'

export async function createCheckout(input: CheckoutInput): Promise<CheckoutResponse> {
  return httpClient<CheckoutResponse>('/public/checkout', {
    method: 'POST',
    body: JSON.stringify({
      plano: input.plano,
      empresaNome: input.empresaNome,
      emailContato: input.emailContato,
      usuarioNome: input.usuarioNome,
      usuarioEmail: input.usuarioEmail,
      usuarioSenha: input.usuarioSenha,
    }),
  })
}

export async function payCheckout(
  token: string,
  confirmation: unknown,
): Promise<CheckoutStatusResponse> {
  return httpClient<CheckoutStatusResponse>(`/public/checkout/${token}/pagar`, {
    method: 'POST',
    body: JSON.stringify({
      payload: encodeCheckoutPayload(stripClientAmount(confirmation)),
    }),
  })
}

function stripClientAmount(confirmation: unknown): unknown {
  if (!confirmation || typeof confirmation !== 'object') {
    return confirmation
  }
  const copy = { ...(confirmation as Record<string, unknown>) }
  delete copy.transaction_amount
  delete copy.notification_url
  if (copy.formData && typeof copy.formData === 'object') {
    const formData = { ...(copy.formData as Record<string, unknown>) }
    delete formData.transaction_amount
    delete formData.notification_url
    copy.formData = formData
  }
  return copy
}

export async function cancelCheckout(token: string): Promise<CheckoutStatusResponse> {
  return httpClient<CheckoutStatusResponse>(`/public/checkout/${token}/cancelar`, {
    method: 'POST',
  })
}

export async function getCheckoutStatus(token: string, paymentId?: string | null): Promise<CheckoutStatusResponse> {
  const query = paymentId ? `?paymentId=${encodeURIComponent(paymentId)}` : ''
  return httpClient<CheckoutStatusResponse>(`/public/checkout/${token}/status${query}`)
}
