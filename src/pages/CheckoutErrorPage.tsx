import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function CheckoutErrorPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <Card className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary-dark">
            !
          </div>
          <h1 className="font-display text-2xl font-bold text-navy">
            Pagamento não concluído
          </h1>
          <p className="mt-3 text-muted">
            O pagamento foi cancelado ou não pôde ser processado. Nenhuma cobrança foi efetuada.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button to="/planos" className="w-full">
              Tentar novamente
            </Button>
            <Button to="/" variant="ghost" className="w-full">
              Voltar ao início
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
