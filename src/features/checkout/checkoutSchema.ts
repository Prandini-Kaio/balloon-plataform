import { z } from 'zod'
import type { PlanoTipo } from '@/features/plans/types'

const planoValues = ['TRIAL', 'MENSAL', 'ANUAL'] as const satisfies readonly PlanoTipo[]

export const checkoutSchema = z
  .object({
    empresaNome: z.string().min(2, 'Informe o nome da empresa'),
    emailContato: z.string().email('E-mail de contato inválido'),
    usuarioNome: z.string().min(2, 'Informe seu nome'),
    usuarioEmail: z.string().email('E-mail inválido'),
    usuarioSenha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    usuarioSenhaConfirmacao: z.string(),
  })
  .refine((data) => data.usuarioSenha === data.usuarioSenhaConfirmacao, {
    message: 'As senhas não coincidem',
    path: ['usuarioSenhaConfirmacao'],
  })

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export function isPlanoValido(value: string | undefined): value is PlanoTipo {
  return planoValues.includes(value as PlanoTipo)
}

export const PLANO_LABELS: Record<PlanoTipo, string> = {
  TRIAL: 'Trial gratuito',
  MENSAL: 'Plano mensal',
  ANUAL: 'Plano anual',
}
