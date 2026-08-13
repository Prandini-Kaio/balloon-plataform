import type { PlanoPublico } from '@/features/plans/types'

export function formatPreco(centavos: number): string {
  if (centavos === 0) return 'Grátis'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100)
}

export function formatPeriodo(tipo: PlanoPublico['tipo'], dias: number): string {
  if (tipo === 'TRIAL') return `${dias} dias`
  if (tipo === 'MENSAL') return '/mês'
  return '/ano'
}
