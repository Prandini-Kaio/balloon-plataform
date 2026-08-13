import { Link } from 'react-router-dom'

export function TermsPage() {
  return (
    <LegalLayout title="Termos de uso">
      <p>Última atualização: julho de 2026.</p>

      <h2>1. Aceitação</h2>
      <p>
        Ao utilizar a plataforma Balloon, você concorda com estes termos. O serviço é oferecido
        como software SaaS para empresas cadastrarem e divulgarem eventos.
      </p>

      <h2>2. Conta empresarial</h2>
      <p>
        Você é responsável por manter a confidencialidade das credenciais de acesso e por todas
        as atividades realizadas na sua conta.
      </p>

      <h2>3. Planos e pagamentos</h2>
      <p>
        Os planos Trial, Mensal e Anual possuem condições, preços e períodos descritos na página
        de planos. O não pagamento após o período contratado pode resultar na suspensão do acesso.
      </p>

      <h2>4. Conteúdo dos eventos</h2>
      <p>
        A empresa é responsável pela veracidade e legalidade das informações publicadas nos
        eventos, incluindo imagens, datas e localização.
      </p>

      <h2>5. Limitação de responsabilidade</h2>
      <p>
        O Balloon atua como plataforma de divulgação e gestão. Não nos responsabilizamos por
        cancelamentos, alterações ou condições dos eventos publicados por terceiros.
      </p>

      <h2>6. Contato</h2>
      <p>
        Dúvidas sobre estes termos:{' '}
        <a href="mailto:support@balloon.com" className="text-brand-mid underline">
          support@balloon.com
        </a>
      </p>
    </LegalLayout>
  )
}

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link to="/" className="text-sm font-semibold text-primary hover:text-primary-dark">
          ← Voltar ao início
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold text-navy">{title}</h1>
        <article className="prose-balloon mt-8 space-y-6 text-navy/90">{children}</article>
      </div>
    </section>
  )
}

export { LegalLayout }
