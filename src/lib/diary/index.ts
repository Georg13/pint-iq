import { supabaseDiaryRepository } from './supabaseDiary'
import type { DiaryRepository } from './types'

export const diaryRepository: DiaryRepository = supabaseDiaryRepository

export type {
  DiaryEntry,
  CreateDiaryEntryInput,
  UpdateDiaryEntryInput,
} from './types'