import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { env } from '@/config/env'
import { getCheckoutStatus, payCheckout } from '@/features/checkout/checkout.api'
import type { CheckoutStatusResponse } from '@/features/checkout/types'

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const paymentId = searchParams.get('payment_id') ?? searchParams.get('collection_id')
  const [status, setStatus] = useState<CheckoutStatusResponse | null>(null)
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) return

    let cancelled = false
    let attempts = 0
    let encodedId = paymentId

    const poll = async () => {
      const result = encodedId
        ? await payCheckout(token, { paymentId: encodedId })
        : await getCheckoutStatus(token)
      if (cancelled) return

      if (result.paymentId) {
        encodedId = result.paymentId
      }
      setStatus(result)
      if (result.status === 'PENDENTE') {
        attempts += 1
        setTimeout(poll, attempts < 20 ? 1500 : 4000)
        return
      }
      setLoading(false)
    }

    poll().catch(() => {
      if (!cancelled) setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [token, paymentId])

  const consoleUrl = status?.consoleUrl || env.adminUrl
  const paid = status?.status === 'PAGO' || Boolean(status?.contaCriada)
  const pending = status?.status === 'PENDENTE'
  const failed =
    status?.status === 'CANCELADO' || status?.status === 'EXPIRADO' || status?.status === 'FALHOU'

  useEffect(() => {
    if (loading || !paid) return
    const timer = window.setTimeout(() => {
      window.location.href = consoleUrl
    }, 2500)
    return () => window.clearTimeout(timer)
  }, [loading, paid, consoleUrl])

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <Card className="text-center">
          {loading || pending ? (
            <>
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-brand-mid/20 border-t-brand-mid" />
              <h1 className="font-display text-2xl font-bold text-navy">
                {pending ? 'Aguardando pagamento…' : 'Confirmando pagamento…'}
              </h1>
              <p className="mt-2 text-muted">
                {pending
                  ? 'Conclua o PIX, débito ou crédito. A conta só é criada depois da confirmação.'
                  : 'Aguarde enquanto ativamos sua conta.'}
              </p>
            </>
          ) : failed ? (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
                !
              </div>
              <h1 className="font-display text-2xl font-bold text-navy">Não foi possível ativar</h1>
              <p className="mt-3 text-muted">
                {status?.status === 'EXPIRADO'
                  ? 'Não encontramos esta sessão de checkout. Inicie o cadastro novamente.'
                  : 'O pagamento não foi concluído ou o e-mail já está em uso.'}
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Button to="/planos" className="w-full">
                  Voltar aos planos
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/30 text-3xl">
                ✓
              </div>
              <h1 className="font-display text-2xl font-bold text-navy">
                Conta criada com sucesso!
              </h1>
              <p className="mt-3 text-muted">
                {status?.empresaNome
                  ? `${status.empresaNome} está pronta para usar o Balloon.`
                  : 'Sua empresa está pronta para usar o Balloon.'}
              </p>
              <p className="mt-2 text-sm text-muted">
                Redirecionando para o painel. Entre com o e-mail e a senha cadastrados.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Button
                  onClick={() => {
                    window.location.href = consoleUrl
                  }}
                  className="w-full"
                >
                  Ir para o painel
                </Button>
                <Button to="/" variant="ghost" className="w-full">
                  Voltar ao início
                </Button>
              </div>
            </>
          )}
        </Card>

        {!token && (
          <p className="mt-6 text-center text-sm text-muted">
            Sessão não encontrada.{' '}
            <Link to="/planos" className="text-brand-mid underline">
              Escolher um plano
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
