import { supabaseBarsRepository } from './supabaseBars'
import type { BarsRepository } from './types'

export const barsRepository: BarsRepository = supabaseBarsRepository

export type { Bar, CreateBarInput, UpdateBarInput, MapProvider } from './types'
export { getMapUrl } from './types'