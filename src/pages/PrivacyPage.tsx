import { Link } from 'react-router-dom'

export function PrivacyPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link to="/" className="text-sm font-semibold text-primary hover:text-primary-dark">
          ← Voltar ao início
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold text-navy">
          Política de privacidade
        </h1>
        <article className="mt-8 space-y-6 text-navy/90">
          <p>Última atualização: julho de 2026.</p>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">1. Dados coletados</h2>
            <p>
              Coletamos dados de cadastro empresarial (nome, e-mail, credenciais de acesso) e
              informações dos eventos publicados (textos, imagens, localização).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">2. Finalidade</h2>
            <p>
              Utilizamos os dados para operar a plataforma, processar pagamentos, exibir eventos
              no app mobile e comunicar alertas relacionados à conta e licença.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">3. Compartilhamento</h2>
            <p>
              Dados de eventos publicados ficam visíveis aos usuários do app. Dados de pagamento
              são processados pelo Mercado Pago conforme a política deles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">4. Seus direitos (LGPD)</h2>
            <p>
              Você pode solicitar acesso, correção ou exclusão dos seus dados entrando em contato
              pelo e-mail{' '}
              <a href="mailto:support@balloon.com" className="text-brand-mid underline">
                support@balloon.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">5. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger os dados, incluindo
              transmissão criptografada e controle de acesso por perfil.
            </p>
          </section>
        </article>
      </div>
    </section>
  )
}
