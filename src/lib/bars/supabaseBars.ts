import { supabase } from '@/lib/supabase/client'
import type { BarsRepository, Bar, CreateBarInput, UpdateBarInput } from './types'

interface BarRow {
  id: string
  user_id: string
  name: string
  country: string
  city: string
  address: string | null
  latitude: number | null
  longitude: number | null
  rating: number | null
  comment: string | null
  created_at: string
  updated_at: string
}

const mapRow = (row: BarRow): Bar => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  country: row.country,
  city: row.city,
  address: row.address ?? undefined,
  latitude: row.latitude ?? undefined,
  longitude: row.longitude ?? undefined,
  rating: row.rating ?? undefined,
  comment: row.comment ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const supabaseBarsRepository: BarsRepository = {

  async getAll() {
    const { data, error } = await supabase
      .from('bars')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as BarRow[]).map(mapRow)
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('bars')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return mapRow(data as BarRow)
  },

  async create(input: CreateBarInput) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('bars')
      .insert({
        user_id: user.id,
        name: input.name,
        country: input.country,
        city: input.city,
        address: input.address ?? null,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        rating: input.rating ?? null,
        comment: input.comment ?? null,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return mapRow(data as BarRow)
  },

  async update(id, input: UpdateBarInput) {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.name !== undefined) updatePayload.name = input.name
    if (input.country !== undefined) updatePayload.country = input.country
    if (input.city !== undefined) updatePayload.city = input.city
    if (input.address !== undefined) updatePayload.address = input.address
    if (input.latitude !== undefined) updatePayload.latitude = input.latitude
    if (input.longitude !== undefined) updatePayload.longitude = input.longitude
    if (input.rating !== undefined) updatePayload.rating = input.rating
    if (input.comment !== undefined) updatePayload.comment = input.comment

    const { data, error } = await supabase
      .from('bars')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return mapRow(data as BarRow)
  },

  async remove(id) {
    const { error } = await supabase
      .from('bars')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}