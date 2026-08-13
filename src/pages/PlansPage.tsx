import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { fetchPlanos } from '@/features/plans/plans.api'
import { formatPeriodo, formatPreco } from '@/features/plans/format'
import type { PlanoPublico } from '@/features/plans/types'

export function PlansPage() {
  const [planos, setPlanos] = useState<PlanoPublico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlanos()
      .then((res) => setPlanos(res.planos))
      .catch(() => setError('Não foi possível carregar os planos.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Planos"
          title="Escolha o ritmo da sua casa"
          subtitle="A assinatura libera o painel e a publicação no app. Destaques regionais são contratados à parte, quando a data precisa de extra."
        />

        {loading && (
          <p className="mt-12 text-center text-muted" role="status">
            Carregando planos…
          </p>
        )}

        {error && (
          <p className="mt-12 text-center text-primary" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {planos.map((plano) => (
              <Card key={plano.tipo} highlight={plano.destaque} className="flex flex-col p-8">
                {plano.destaque && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-gradient-warm px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Mais popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-navy">{plano.nome}</h3>
                <p className="mt-2 text-sm text-muted">{plano.descricao}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-navy">
                    {formatPreco(plano.valorCentavos)}
                  </span>
                  <span className="text-sm text-muted">
                    {formatPeriodo(plano.tipo, plano.periodoDias)}
                  </span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plano.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-navy/90">
                      <span className="mt-0.5 font-bold text-primary" aria-hidden>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  to={`/checkout/${plano.tipo}`}
                  variant={plano.destaque ? 'primary' : 'outline'}
                  className="mt-8 w-full"
                >
                  {plano.tipo === 'TRIAL' ? 'Começar grátis' : 'Assinar agora'}
                </Button>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 overflow-hidden rounded-[2rem] border border-border bg-white p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Add-on</p>
          <h2 className="mt-2 text-2xl font-bold text-navy">Destaques no app — à parte</h2>
          <p className="mt-3 max-w-3xl text-muted">
            Amplie a visibilidade com campanhas por região, período e mídia. Disponíveis para
            Mensal e Anual, contratadas no painel depois do login — não entram no valor da
            assinatura.
          </p>
        </div>
      </Container>
    </section>
  )
}
