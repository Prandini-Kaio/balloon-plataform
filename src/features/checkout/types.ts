import type { PlanoTipo } from '@/features/plans/types'

export type CheckoutStatus = 'PENDENTE' | 'PAGO' | 'EXPIRADO' | 'CANCELADO' | 'FALHOU'

export type CheckoutInput = {
  plano: PlanoTipo
  empresaNome: string
  emailContato: string
  usuarioNome: string
  usuarioEmail: string
  usuarioSenha: string
}

export type CheckoutResponse = {
  sessionToken: string
  status: CheckoutStatus
  initPoint?: string
  redirectUrl?: string
  consoleUrl?: string
  requiresPayment?: boolean
  valorCentavos?: number
  publicKey?: string
  payerEmail?: string
}

export type CheckoutStatusResponse = {
  sessionToken: string
  status: CheckoutStatus
  plano: PlanoTipo
  empresaNome?: string
  consoleUrl?: string
  valorCentavos?: number
  publicKey?: string
  payerEmail?: string
  paymentId?: string | null
  paymentStatus?: string | null
  pixCopiaECola?: string | null
  pixQrCodeBase64?: string | null
  contaCriada?: boolean
}
