export interface CreateBarInput {
  name: string
  country: string
  city: string
  address?: string
  latitude?: number
  longitude?: number
  rating?: number
  comment?: string
}

export interface UpdateBarInput {
  name?: string
  country?: string
  city?: string
  address?: string
  latitude?: number
  longitude?: number
  rating?: number
  comment?: string
}

export interface Bar {
  id: string
  userId: string
  name: string
  country: string
  city: string
  address?: string
  latitude?: number
  longitude?: number
  rating?: number
  comment?: string
  createdAt: string
  updatedAt: string
}

export interface BarsRepository {
  getAll(): Promise<Bar[]>
  getById(id: string): Promise<Bar | null>
  create(input: CreateBarInput): Promise<Bar>
  update(id: string, input: UpdateBarInput): Promise<Bar>
  remove(id: string): Promise<void>
}

export type MapProvider = 'google' | 'yandex'

// Deep link (для постройки маршрута на картах Гугла и Яндекса)
export const getMapUrl = (bar: Bar, provider: MapProvider = 'google'): string => {
  const query = bar.latitude && bar.longitude
    ? `${bar.latitude},${bar.longitude}`
    : encodeURIComponent(`${bar.name}, ${bar.address ?? ''}, ${bar.city}, ${bar.country}`)

  if (provider === 'yandex') {
    return `https://yandex.ru/maps/?text=${query}`
  }

  return `https://www.google.com/maps/search/?api=1&query=${query}`
}