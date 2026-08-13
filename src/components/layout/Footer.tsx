import { Link } from 'react-router-dom'
import { env } from '@/config/env'
import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <img
            src="/brand/logo_amarelo_portugues.svg"
            alt="Balloon"
            className="mb-5 h-11 w-auto"
          />
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            O Balloon une o calor de um evento ao pin do mapa: sua empresa publica no painel,
            o público descobre no app e a cidade encontra o que está acontecendo.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-accent">
            Produto
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to="/planos" className="hover:text-white">
                Planos
              </Link>
            </li>
            <li>
              <Link to="/#recursos" className="hover:text-white">
                Recursos
              </Link>
            </li>
            <li>
              <a href={env.adminUrl} className="hover:text-white">
                Painel empresarial
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-accent">
            Legal
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to="/termos" className="hover:text-white">
                Termos de uso
              </Link>
            </li>
            <li>
              <Link to="/privacidade" className="hover:text-white">
                Privacidade
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Balloon. Eventos que sobem.
      </div>
    </footer>
  )
}
