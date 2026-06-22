import type { RatingCategory, BeerType, BeerStyle } from '@/types/diary'

// Данные для создания новой записи в дневнике
export interface CreateDiaryEntryInput {
  beerId: string
  beerName: string
  beerImage?: string
  rating: number
  userType?: BeerType
  userStyle?: BeerStyle
  note?: string
}

// Данные для обновления существующей записи
export interface UpdateDiaryEntryInput {
  rating?: number
  userType?: BeerType
  userStyle?: BeerStyle
  note?: string
}

// Полная запись дневника
export interface DiaryEntry {
  id: string
  userId: string
  beerId: string
  beerName: string
  beerImage?: string
  rating: number
  ratingCategory: RatingCategory
  userType?: BeerType
  userStyle?: BeerStyle
  note?: string
  createdAt: string
  updatedAt: string
}

// Контракт
export interface DiaryRepository {
  getAll(): Promise<DiaryEntry[]>
  getById(id: string): Promise<DiaryEntry | null>
  getByBeerId(beerId: string): Promise<DiaryEntry | null> 
  create(input: CreateDiaryEntryInput): Promise<DiaryEntry>
  update(id: string, input: UpdateDiaryEntryInput): Promise<DiaryEntry>
  remove(id: string): Promise<void>
}