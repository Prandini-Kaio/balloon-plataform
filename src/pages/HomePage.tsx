import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { fetchPlanos } from '@/features/plans/plans.api'
import { formatPeriodo, formatPreco } from '@/features/plans/format'
import type { PlanoPublico } from '@/features/plans/types'

const FEATURES = [
  {
    title: 'No mapa, de verdade',
    description:
      'Seu evento vira um pin no app. Quem está perto descobre por região, categoria e data — sem depender só de feed.',
  },
  {
    title: 'Painel para o time',
    description:
      'Cadastre, edite e acompanhe eventos com métricas de acessos, check-in, favoritos e cliques no WhatsApp.',
  },
  {
    title: 'Destaques regionais',
    description:
      'Add-on pago à parte: campanhas por cidade e período para ocupar o topo do app onde seu público está.',
  },
  {
    title: 'App do público',
    description:
      'Pessoas exploram, salvam favoritos e conversam com a casa. Sua marca chega no bolso de quem vai sair.',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Escolha o plano',
    description: 'Comece com 14 dias grátis ou assine mensal/anual conforme o ritmo da casa.',
  },
  {
    step: '02',
    title: 'Abra sua conta',
    description: 'Cadastro empresarial em minutos, com acesso imediato ao Balloon Console.',
  },
  {
    step: '03',
    title: 'Publique e suba',
    description: 'Capas, datas, local e categorias — sincronizado com o mapa e o app.',
  },
]

const PROOF = [
  { value: '14 dias', label: 'para testar sem cartão no trial' },
  { value: '3 planos', label: 'do trial ao anual ilimitado' },
  { value: '1 plataforma', label: 'painel, app e mapa juntos' },
]

const FAQ = [
  {
    q: 'O trial precisa de cartão?',
    a: 'Não. O trial de 14 dias libera o painel e a publicação no app para você validar o fluxo com a equipe.',
  },
  {
    q: 'Destaques regionais estão inclusos?',
    a: 'Não. São campanhas contratadas à parte, por região e período, depois do login — pensadas para impulsionar datas específicas.',
  },
  {
    q: 'Para quem é o Balloon?',
    a: 'Casas de show, produtoras, bares, espaços culturais e negócios locais que precisam aparecer onde o público decide sair.',
  },
  {
    q: 'Consigo ver se o evento performou?',
    a: 'Sim. No painel você acompanha acessos, check-ins, favoritos e cliques para conversar no WhatsApp.',
  },
]

export function HomePage() {
  const [planos, setPlanos] = useState<PlanoPublico[]>([])

  useEffect(() => {
    fetchPlanos()
      .then((res) => setPlanos(res.planos))
      .catch(() => setPlanos([]))
  }, [])

  return (
    <>
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              SaaS para empresas de eventos
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Eventos que <span className="text-gradient-brand">sobem</span>
              <br />
              até o seu público
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Publique no painel, apareça no mapa do app e alcance quem está na sua cidade.
              O Balloon une balão e pin: energia para destacar, precisão para localizar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/checkout/TRIAL" size="lg">
                Começar 14 dias grátis
              </Button>
              <Button to="/planos" variant="outline" size="lg">
                Ver planos
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted">Sem cartão no trial · Cancele quando quiser</p>
          </div>

          <div className="relative flex min-h-[320px] items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
            <div className="absolute bottom-4 right-8 h-40 w-40 rounded-full bg-brand-light/40 blur-3xl" />
            <img
              src="/brand/logo_amarelo_baloes.svg"
              alt="Balões Balloon"
              className="float-slow relative z-10 max-h-80 w-full max-w-md object-contain drop-shadow-2xl"
            />
            <img
              src="/brand/Balloon_amarelo.svg"
              alt=""
              className="float-slower absolute bottom-6 left-4 z-20 h-16 w-16 drop-shadow-lg sm:h-20 sm:w-20"
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-border/70 bg-white/60">
        <Container className="grid gap-8 py-10 sm:grid-cols-3">
          {PROOF.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="font-display text-2xl font-bold text-navy">{item.value}</p>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section id="recursos" className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Por que Balloon"
            title="Do palco ao pin do mapa, em um só produto"
            subtitle="Feito para produtoras, casas de show e negócios locais que querem ser encontrados — não só postados."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <Card key={feature.title} className="h-full p-8">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-warm font-display text-sm font-bold text-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-navy">{feature.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-8">
        <Container className="grid overflow-hidden rounded-[2rem] bg-navy text-white lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Console</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Gestão que cabe no dia a dia da casa</h2>
            <p className="mt-4 text-white/75">
              Equipe publica eventos, acompanha licença e vê o que o público realmente fez:
              abriu, favoritou, fez check-in ou chamou no WhatsApp.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              <li>— Eventos ilimitados no plano anual</li>
              <li>— Métricas por evento no painel</li>
              <li>— Destaques regionais quando a data precisa de extra</li>
            </ul>
          </div>
          <div className="relative flex items-end justify-center bg-gradient-brand p-8">
            <img
              src="/brand/logo_azul_baloes.svg"
              alt="Identidade azul Balloon"
              className="max-h-56 w-full max-w-xs object-contain drop-shadow-xl"
            />
          </div>
        </Container>
      </section>

      <section id="como-funciona" className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Como funciona"
            title="Três passos para colocar a casa no ar"
            subtitle="Sem setup infinito: plano, conta e publicação."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-[1.75rem] border border-border bg-white/80 p-7 shadow-sm"
              >
                <span className="font-display text-4xl font-bold text-primary/80">{item.step}</span>
                <h3 className="mt-4 text-xl font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {planos.length > 0 ? (
        <section className="pb-8">
          <Container>
            <SectionHeading
              eyebrow="Planos"
              title="Comece grátis. Escale quando a agenda crescer."
              subtitle="Trial para validar. Mensal para flexibilidade. Anual para o melhor custo."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {planos.map((plano) => (
                <Card key={plano.tipo} highlight={plano.destaque} className="flex flex-col p-8">
                  {plano.destaque ? (
                    <span className="mb-4 inline-flex w-fit rounded-full bg-gradient-warm px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      Mais escolhido
                    </span>
                  ) : null}
                  <h3 className="text-2xl font-bold text-navy">{plano.nome}</h3>
                  <p className="mt-2 text-sm text-muted">{plano.descricao}</p>
                  <p className="mt-6 font-display text-4xl font-bold text-navy">
                    {formatPreco(plano.valorCentavos)}
                    <span className="ml-1 text-base font-normal text-muted">
                      {formatPeriodo(plano.tipo, plano.periodoDias)}
                    </span>
                  </p>
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
            <p className="mt-6 text-center text-sm text-muted">
              Quer o detalhe completo?{' '}
              <Link to="/planos" className="font-semibold text-primary hover:underline">
                Comparar planos
              </Link>
            </p>
          </Container>
        </section>
      ) : null}

      <section className="py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Dúvidas" title="Antes de subir no Balloon" />
          <div className="mt-10 divide-y divide-border overflow-hidden rounded-[1.75rem] border border-border bg-white">
            {FAQ.map((item) => (
              <details key={item.q} className="group px-6 py-5">
                <summary className="cursor-pointer list-none font-display text-lg font-semibold text-navy marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-primary transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="overflow-hidden rounded-[2rem] bg-gradient-warm px-6 py-14 text-center text-navy shadow-xl shadow-primary/20 sm:px-12">
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">
              Pronto para fazer seus eventos subirem?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-navy/80">
              14 dias para publicar, aparecer no mapa e sentir o movimento no painel.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button to="/checkout/TRIAL" size="lg" variant="secondary">
                Começar trial gratuito
              </Button>
              <Button to="/planos" size="lg" variant="light">
                Comparar planos
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
