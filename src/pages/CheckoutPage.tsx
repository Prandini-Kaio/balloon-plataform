import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckoutPaymentPanel } from '@/features/checkout/CheckoutPaymentPanel'
import { cancelCheckout, createCheckout, getCheckoutStatus, payCheckout } from '@/features/checkout/checkout.api'
import {
  checkoutSchema,
  isPlanoValido,
  PLANO_LABELS,
  type CheckoutFormValues,
} from '@/features/checkout/checkoutSchema'
import type { CheckoutStatusResponse } from '@/features/checkout/types'
import { fetchPlanos } from '@/features/plans/plans.api'
import { formatPeriodo, formatPreco } from '@/features/plans/format'
import type { PlanoPublico } from '@/features/plans/types'

type Step = 'dados' | 'pagamento'

const RESUME_KEY = 'balloon_checkout_resume'

type ResumeState = {
  token: string
  plano: string
}

export function CheckoutPage() {
  const { plano: planoParam } = useParams()
  const navigate = useNavigate()
  const [planoInfo, setPlanoInfo] = useState<PlanoPublico | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loadingPlano, setLoadingPlano] = useState(true)
  const [step, setStep] = useState<Step>('dados')
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [payerEmail, setPayerEmail] = useState<string | undefined>()
  const [publicKey, setPublicKey] = useState<string | undefined>()
  const [pendingPix, setPendingPix] = useState<CheckoutStatusResponse | null>(null)
  const [valorCobrado, setValorCobrado] = useState<number | null>(null)
  const paymentIdRef = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  })

  useEffect(() => {
    if (!isPlanoValido(planoParam)) return

    fetchPlanos()
      .then((res) => {
        const found = res.planos.find((p) => p.tipo === planoParam) ?? null
        setPlanoInfo(found)
      })
      .finally(() => setLoadingPlano(false))
  }, [planoParam])

  useEffect(() => {
    if (!isPlanoValido(planoParam) || planoParam === 'TRIAL') return

    let raw: string | null = null
    try {
      raw = sessionStorage.getItem(RESUME_KEY)
    } catch {
      return
    }
    if (!raw) return

    try {
      const resume = JSON.parse(raw) as ResumeState
      if (resume.plano !== planoParam || !resume.token) return

      getCheckoutStatus(resume.token)
        .then((status) => {
          if (status.status === 'PAGO') {
            navigate(`/checkout/sucesso?token=${status.sessionToken}`, { replace: true })
            return
          }
          if (status.status !== 'PENDENTE') {
            sessionStorage.removeItem(RESUME_KEY)
            return
          }
          setSessionToken(status.sessionToken)
          setPayerEmail(status.payerEmail)
          setPublicKey(status.publicKey)
          if (typeof status.valorCentavos === 'number') {
            setValorCobrado(status.valorCentavos)
          }
          paymentIdRef.current = status.paymentId ?? null
          setPendingPix(status.pixCopiaECola ? status : null)
          setStep('pagamento')
        })
        .catch(() => {
          sessionStorage.removeItem(RESUME_KEY)
        })
    } catch {
      sessionStorage.removeItem(RESUME_KEY)
    }
  }, [planoParam, navigate])

  useEffect(() => {
    if (step !== 'pagamento' || !sessionToken) return

    let cancelled = false
    const poll = async () => {
      try {
        const paymentId = paymentIdRef.current
        const result = paymentId
          ? await payCheckout(sessionToken, { paymentId })
          : await getCheckoutStatus(sessionToken)
        if (cancelled) return
        if (result.paymentId) {
          paymentIdRef.current = result.paymentId
        }
        if (result.status === 'PAGO' || result.contaCriada) {
          sessionStorage.removeItem(RESUME_KEY)
          navigate(`/checkout/sucesso?token=${result.sessionToken}`, { replace: true })
          return
        }
        if (result.pixCopiaECola) {
          setPendingPix(result)
        }
      } catch {
        if (cancelled) return
      }
      window.setTimeout(poll, 2500)
    }

    const timer = window.setTimeout(poll, 2500)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [step, sessionToken, navigate])

  const onPaid = useCallback(
    (result: CheckoutStatusResponse) => {
      sessionStorage.removeItem(RESUME_KEY)
      navigate(`/checkout/sucesso?token=${result.sessionToken}`, { replace: true })
    },
    [navigate],
  )

  const onPending = useCallback((result: CheckoutStatusResponse) => {
    if (result.paymentId) {
      paymentIdRef.current = result.paymentId
    }
    if (result.pixCopiaECola) {
      setPendingPix(result)
    }
  }, [])

  const onPayError = useCallback((message: string) => {
    setSubmitError(message)
  }, [])

  const onCancelPayment = useCallback(async () => {
    if (!sessionToken) return
    setSubmitError(null)
    try {
      await cancelCheckout(sessionToken)
      sessionStorage.removeItem(RESUME_KEY)
      navigate('/planos', { replace: true })
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Não foi possível cancelar o pagamento.')
    }
  }, [sessionToken, navigate])

  if (!isPlanoValido(planoParam)) {
    return <Navigate to="/planos" replace />
  }

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitError(null)

    try {
      const response = await createCheckout({
        plano: planoParam,
        empresaNome: values.empresaNome,
        emailContato: values.emailContato,
        usuarioNome: values.usuarioNome,
        usuarioEmail: values.usuarioEmail,
        usuarioSenha: values.usuarioSenha,
      })

      if (response.status === 'PAGO' || !response.requiresPayment) {
        navigate(`/checkout/sucesso?token=${response.sessionToken}`)
        return
      }

      sessionStorage.setItem(
        RESUME_KEY,
        JSON.stringify({ token: response.sessionToken, plano: planoParam } satisfies ResumeState),
      )
      setSessionToken(response.sessionToken)
      setPayerEmail(response.payerEmail)
      setPublicKey(response.publicKey)
      if (typeof response.valorCentavos === 'number') {
        setValorCobrado(response.valorCentavos)
      }
      setStep('pagamento')
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Não foi possível processar o cadastro. Tente novamente.')
    }
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/planos" className="text-sm font-semibold text-primary hover:text-primary-dark">
            ← Voltar aos planos
          </Link>

          <h1 className="mt-4 font-display text-3xl font-bold text-navy">
            {step === 'pagamento' ? 'Pague para criar a conta' : 'Criar conta empresarial'}
          </h1>
          <p className="mt-2 text-muted">
            {step === 'pagamento'
              ? `Conclua o pagamento do ${PLANO_LABELS[planoParam]} com PIX, débito ou crédito. A conta só é criada depois da confirmação.`
              : `Preencha os dados abaixo para ${planoParam === 'TRIAL' ? 'ativar o trial' : 'iniciar a compra do ' + PLANO_LABELS[planoParam]}.`}
          </p>

          {loadingPlano ? (
            <p className="mt-8 text-sm text-muted">Carregando plano…</p>
          ) : planoInfo ? (
            <Card className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Plano selecionado
              </p>
              <h2 className="mt-2 font-display text-xl font-bold">{planoInfo.nome}</h2>
              <p className="mt-1 text-sm text-muted">{planoInfo.descricao}</p>
              <p className="mt-4 font-display text-3xl font-bold text-navy">
                {formatPreco(planoInfo.valorCentavos)}
                <span className="text-base font-normal text-muted">
                  {' '}
                  {formatPeriodo(planoInfo.tipo, planoInfo.periodoDias)}
                </span>
              </p>
            </Card>
          ) : null}
        </div>

        <Card className="lg:col-span-3">
          {step === 'pagamento' && sessionToken && valorCobrado != null ? (
            <>
              {submitError && (
                <p className="mb-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary-dark" role="alert">
                  {submitError}
                </p>
              )}
              <CheckoutPaymentPanel
                token={sessionToken}
                valorCentavos={valorCobrado}
                publicKey={publicKey}
                payerEmail={payerEmail}
                initialPix={pendingPix}
                onPaid={onPaid}
                onPending={onPending}
                onCancel={onCancelPayment}
                onError={onPayError}
              />
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <fieldset className="space-y-4">
                <legend className="font-display text-lg font-semibold text-navy">
                  Dados da empresa
                </legend>

                <Field label="Nome da empresa" error={errors.empresaNome?.message}>
                  <input
                    {...register('empresaNome')}
                    className={inputClass(errors.empresaNome)}
                    placeholder="Ex.: Casa de Eventos Aurora"
                    autoComplete="organization"
                  />
                </Field>

                <Field label="E-mail de contato" error={errors.emailContato?.message}>
                  <input
                    {...register('emailContato')}
                    type="email"
                    className={inputClass(errors.emailContato)}
                    placeholder="contato@empresa.com"
                    autoComplete="email"
                  />
                </Field>
              </fieldset>

              <fieldset className="space-y-4 border-t border-border pt-5">
                <legend className="font-display text-lg font-semibold text-navy">
                  Administrador da conta
                </legend>

                <Field label="Seu nome" error={errors.usuarioNome?.message}>
                  <input
                    {...register('usuarioNome')}
                    className={inputClass(errors.usuarioNome)}
                    placeholder="Nome completo"
                    autoComplete="name"
                  />
                </Field>

                <Field label="E-mail de acesso" error={errors.usuarioEmail?.message}>
                  <input
                    {...register('usuarioEmail')}
                    type="email"
                    className={inputClass(errors.usuarioEmail)}
                    placeholder="voce@empresa.com"
                    autoComplete="username"
                  />
                </Field>

                <Field label="Senha" error={errors.usuarioSenha?.message}>
                  <input
                    {...register('usuarioSenha')}
                    type="password"
                    className={inputClass(errors.usuarioSenha)}
                    autoComplete="new-password"
                  />
                </Field>

                <Field label="Confirmar senha" error={errors.usuarioSenhaConfirmacao?.message}>
                  <input
                    {...register('usuarioSenhaConfirmacao')}
                    type="password"
                    className={inputClass(errors.usuarioSenhaConfirmacao)}
                    autoComplete="new-password"
                  />
                </Field>
              </fieldset>

              {submitError && (
                <p className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary-dark" role="alert">
                  {submitError}
                </p>
              )}

              <p className="text-xs leading-relaxed text-muted">
                {planoParam === 'TRIAL'
                  ? 'O trial cria a conta na hora, sem cobrança.'
                  : 'Seus dados ficam reservados. A conta só é criada depois do pagamento confirmado.'}{' '}
                Ao continuar, você concorda com os{' '}
                <Link to="/termos" className="text-brand-mid underline">
                  Termos de uso
                </Link>{' '}
                e a{' '}
                <Link to="/privacidade" className="text-brand-mid underline">
                  Política de privacidade
                </Link>
                .
              </p>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Processando…'
                  : planoParam === 'TRIAL'
                    ? 'Ativar trial gratuito'
                    : 'Continuar para pagamento'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-primary-dark" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function inputClass(hasError: unknown) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-navy placeholder:text-muted/60 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
    hasError ? 'border-primary' : 'border-border'
  }`
}
