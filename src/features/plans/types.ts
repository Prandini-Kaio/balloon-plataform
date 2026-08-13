export type PlanoTipo = 'TRIAL' | 'MENSAL' | 'ANUAL'

export type PlanoLimites = {
  maxEventosAtivos: number | null
  maxUsuarios: number | null
}

export type PlanoPublico = {
  tipo: PlanoTipo
  nome: string
  descricao: string
  valorCentavos: number
  periodoDias: number
  destaque?: boolean
  features: string[]
  limites: PlanoLimites
  entitlements: string[]
}

export type PlanosResponse = {
  planos: PlanoPublico[]
}
