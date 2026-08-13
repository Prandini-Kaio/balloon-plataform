import { httpClient } from '@/core/api/httpClient'
import type { PlanosResponse } from './types'

export async function fetchPlanos(): Promise<PlanosResponse> {
  return httpClient<PlanosResponse>('/public/planos')
}
