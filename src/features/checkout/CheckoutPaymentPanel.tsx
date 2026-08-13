import { useEffect, useRef, useState } from 'react'
import { env } from '@/config/env'
import { Button } from '@/components/ui/Button'
import { payCheckout } from '@/features/checkout/checkout.api'
import { loadMercadoPagoSdk, reaisFromCentavos } from '@/features/checkout/mercadopago'
import type { CheckoutStatusResponse } from '@/features/checkout/types'

const BRICK_ID = 'balloon-payment-brick'

type Props = {
  token: string
  valorCentavos: number
  publicKey?: string
  payerEmail?: string
  initialPix?: CheckoutStatusResponse | null
  onPaid: (result: CheckoutStatusResponse) => void
  onPending?: (result: CheckoutStatusResponse) => void
  onCancel?: () => void
  onError: (message: string) => void
}

export function CheckoutPaymentPanel({
  token,
  valorCentavos,
  publicKey,
  payerEmail,
  initialPix,
  onPaid,
  onPending,
  onCancel,
  onError,
}: Props) {
  const [pix, setPix] = useState<CheckoutStatusResponse | null>(
    initialPix?.pixCopiaECola ? initialPix : null,
  )
  const [copied, setCopied] = useState(false)
  const brickRef = useRef<{ unmount: () => void } | null>(null)
  const key = publicKey || env.mercadoPagoPublicKey

  useEffect(() => {
    if (pix) return

    if (!key) {
      onError('Pagamento ainda não está configurado neste ambiente.')
      return
    }

    let cancelled = false

    loadMercadoPagoSdk()
      .then(async () => {
        if (cancelled || !window.MercadoPago) return
        const mp = new window.MercadoPago(key, { locale: 'pt-BR' })
        brickRef.current?.unmount()
        brickRef.current = await mp.bricks().create('payment', BRICK_ID, {
          initialization: {
            amount: reaisFromCentavos(valorCentavos),
            payer: payerEmail ? { email: payerEmail } : undefined,
          },
          customization: {
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              bankTransfer: 'all',
              maxInstallments: 12,
            },
            visual: {
              style: {
                theme: 'default',
              },
            },
          },
          callbacks: {
            onReady: () => undefined,
            onError: (error: { message?: string }) => {
              onError(error.message || 'Não foi possível carregar o pagamento.')
            },
            onSubmit: (brickSubmit: {
              selectedPaymentMethod?: string
              formData?: Record<string, unknown>
            }) => {
              return payCheckout(token, brickSubmit.formData ?? brickSubmit)
                .then((result) => {
                  if (result.status === 'PAGO' || result.contaCriada) {
                    onPaid(result)
                    return
                  }
                  if (result.pixCopiaECola) {
                    brickRef.current?.unmount()
                    brickRef.current = null
                    onPending?.(result)
                    setPix(result)
                    return
                  }
                  if (result.status === 'PENDENTE') {
                    onPending?.(result)
                    return
                  }
                  throw new Error('Pagamento ainda não foi confirmado. Tente outro método.')
                })
                .catch((error: unknown) => {
                  throw error instanceof Error ? error : new Error('Falha no pagamento.')
                })
            },
          },
        })
      })
      .catch((error: unknown) => {
        onError(error instanceof Error ? error.message : 'Falha ao iniciar o pagamento.')
      })

    return () => {
      cancelled = true
      brickRef.current?.unmount()
      brickRef.current = null
    }
  }, [key, token, valorCentavos, payerEmail, pix, onPaid, onPending, onError])

  if (pix?.pixCopiaECola) {
    return (
      <PixWaiting
        pix={pix}
        copied={copied}
        onCopy={async () => {
          await navigator.clipboard.writeText(pix.pixCopiaECola ?? '')
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        }}
        onCancel={onCancel}
      />
    )
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        Pague no site com PIX, débito ou crédito. Sua conta Balloon só é criada após a confirmação no servidor.
      </p>
      <div id={BRICK_ID} className="min-h-[320px]" />
      {onCancel ? (
        <Button type="button" variant="ghost" className="mt-4 w-full" onClick={onCancel}>
          Cancelar pagamento
        </Button>
      ) : null}
    </div>
  )
}

function PixWaiting({
  pix,
  copied,
  onCopy,
  onCancel,
}: {
  pix: CheckoutStatusResponse
  copied: boolean
  onCopy: () => void
  onCancel?: () => void
}) {
  return (
    <div className="space-y-4 text-center">
      <p className="font-display text-lg font-semibold text-navy">Pague com PIX para criar a conta</p>
      <p className="text-sm text-muted">
        Escaneie o QR Code ou copie o código. Assim que o Mercado Pago confirmar, o Balloon cria a empresa e o usuário.
      </p>
      {pix.pixQrCodeBase64 ? (
        <img
          src={`data:image/png;base64,${pix.pixQrCodeBase64}`}
          alt="QR Code PIX"
          className="mx-auto h-52 w-52 rounded-2xl border border-border bg-white p-3"
        />
      ) : (
        <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border border-dashed border-brand-mid/40 bg-cream text-sm text-muted">
          QR Code PIX
        </div>
      )}
      <div className="rounded-xl border border-border bg-white px-3 py-2 text-left">
        <p className="break-all font-mono text-[11px] leading-relaxed text-navy/80">{pix.pixCopiaECola}</p>
      </div>
      <Button type="button" className="w-full" onClick={onCopy}>
        {copied ? 'Código copiado' : 'Copiar código PIX'}
      </Button>
      {onCancel ? (
        <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
          Cancelar pagamento
        </Button>
      ) : null}
      <p className="text-xs text-muted">Aguardando confirmação do pagamento…</p>
    </div>
  )
}
