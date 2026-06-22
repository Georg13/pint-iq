import { supabase } from '@/lib/supabase/client'
import { getRatingCategory } from '@/types/diary'
import type {
  DiaryRepository,
  DiaryEntry,
  CreateDiaryEntryInput,
  UpdateDiaryEntryInput,
} from './types'

// Структура Supabase (snake_case)
interface DiaryEntryRow {
  id: string
  user_id: string
  beer_id: string
  beer_name: string
  beer_image: string | null
  rating: number
  rating_category: string
  user_type: string | null
  user_style: string | null
  note: string | null
  created_at: string
  updated_at: string
}

// Преобразуем строку snake_case в camelCase
const mapRow = (row: DiaryEntryRow): DiaryEntry => ({
  id: row.id,
  userId: row.user_id,
  beerId: row.beer_id,
  beerName: row.beer_name,
  beerImage: row.beer_image ?? undefined,
  rating: row.rating,
  ratingCategory: row.rating_category as DiaryEntry['ratingCategory'],
  userType: row.user_type as DiaryEntry['userType'],
  userStyle: row.user_style as DiaryEntry['userStyle'],
  note: row.note ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const supabaseDiaryRepository: DiaryRepository = {

  async getAll() {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as DiaryEntryRow[]).map(mapRow)
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return mapRow(data as DiaryEntryRow)
  },

  async getByBeerId(beerId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('beer_id', beerId)
    .maybeSingle()   // если записи нет, просто вернёт null

  if (error || !data) return null
  return mapRow(data as DiaryEntryRow)
},

  async create(input: CreateDiaryEntryInput) {
    // Получаем текущего пользователя
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('diary_entries')
      .insert({
        user_id: user.id,
        beer_id: input.beerId,
        beer_name: input.beerName,
        beer_image: input.beerImage ?? null,
        rating: input.rating,
        rating_category: getRatingCategory(input.rating),
        user_type: input.userType ?? null,
        user_style: input.userStyle ?? null,
        note: input.note ?? null,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return mapRow(data as DiaryEntryRow)
  },

  async update(id, input: UpdateDiaryEntryInput) {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.rating !== undefined) {
      updatePayload.rating = input.rating
      updatePayload.rating_category = getRatingCategory(input.rating)
    }
    if (input.userType !== undefined) updatePayload.user_type = input.userType
    if (input.userStyle !== undefined) updatePayload.user_style = input.userStyle
    if (input.note !== undefined) updatePayload.note = input.note

    const { data, error } = await supabase
      .from('diary_entries')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return mapRow(data as DiaryEntryRow)
  },

  async remove(id) {
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)
  },
}