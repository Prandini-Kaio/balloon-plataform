import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { env } from '@/config/env'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

const links = [
  { to: '/#recursos', label: 'Recursos' },
  { to: '/#como-funciona', label: 'Como funciona' },
  { to: '/planos', label: 'Planos' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="glass-header sticky top-0 z-50 border-b border-border/50">
      <Container className="flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Balloon — início">
          <img
            src="/brand/logo_amarelo_lateral_esquerdo.svg"
            alt="Balloon"
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-sm font-semibold text-navy/75 transition-colors hover:text-primary"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={env.adminUrl}
            className="hidden text-sm font-semibold text-navy/70 hover:text-primary sm:inline"
          >
            Entrar
          </a>
          <Button to="/checkout/TRIAL" size="sm" className="hidden sm:inline-flex">
            Começar grátis
          </Button>
          <Button to="/planos" size="sm" variant="outline" className="sm:hidden">
            Planos
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/70 md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-4 bg-navy transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-4 bg-navy transition ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-4 bg-navy transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-border/60 bg-cream/95 md:hidden">
          <Container className="flex flex-col gap-3 py-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-display text-base font-semibold text-navy"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a href={env.adminUrl} className="text-sm font-semibold text-brand-mid">
              Entrar no painel
            </a>
            <Button to="/checkout/TRIAL" onClick={() => setOpen(false)}>
              Começar grátis
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
