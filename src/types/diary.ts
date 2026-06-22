export type RatingCategory =
  | 'trial'       // 0-2  🤢 "Испытание"
  | 'greedy'      // 3-4  😬 "Допить из жадности"
  | 'drinkable'   // 5-6  😐 "Пить можно"
  | 'good'        // 7-8  🙂 "Хороший экземпляр"
  | 'bliss'       // 9-10 😋 "Блаженство"


export type BeerType =
  | 'Ale'
  | 'Lager'
  | 'Wheat Beer'
  | 'Sour Beer'
  | 'Lambic & Wild Beer'
  | 'Hybrid Beer'
  | 'Specialty Beer'

export type BeerStyle =
  // Ale
  | 'IPA' | 'Pale Ale' | 'Stout' | 'Porter'
  | 'Brown Ale' | 'Belgian Ale' | 'Saison'
  | 'Barleywine' | 'Old Ale' | 'Strong Ale' | 'Mild Ale'
  // Lager
  | 'Pilsner' | 'Helles' | 'Märzen' | 'Bock'
  | 'Dark Lager' | 'Vienna Lager' | 'American Lager'
  // Wheat Beer
  | 'Hefeweizen' | 'Witbier' | 'Weizenbock' | 'American Wheat'
  // Sour
  | 'Gose' | 'Berliner Weisse' | 'Flanders Red'
  // Lambic
  | 'Lambic' | 'Gueuze' | 'Fruit Lambic'
  // Hybrid
  | 'Kölsch' | 'Altbier' | 'Cream Ale'
  // Specialty
  | 'Fruit Beer' | 'Smoked Beer' | 'Honey Beer'
  | 'Coffee Beer' | 'Chocolate Beer' | 'Barrel Aged'

// Связь тип → доступные стили (для UI)
export const STYLES_BY_TYPE: Record<BeerType, BeerStyle[]> = {
  'Ale': ['IPA', 'Pale Ale', 'Stout', 'Porter', 'Brown Ale', 'Belgian Ale', 'Saison', 'Barleywine', 'Old Ale', 'Strong Ale', 'Mild Ale'],
  'Lager': ['Pilsner', 'Helles', 'Märzen', 'Bock', 'Dark Lager', 'Vienna Lager', 'American Lager'],
  'Wheat Beer': ['Hefeweizen', 'Witbier', 'Weizenbock', 'American Wheat'],
  'Sour Beer': ['Gose', 'Berliner Weisse', 'Flanders Red'],
  'Lambic & Wild Beer': ['Lambic', 'Gueuze', 'Fruit Lambic'],
  'Hybrid Beer': ['Kölsch', 'Altbier', 'Cream Ale'],
  'Specialty Beer': ['Fruit Beer', 'Smoked Beer', 'Honey Beer', 'Coffee Beer', 'Chocolate Beer', 'Barrel Aged'],
}

// Оценка → категория
export const getRatingCategory = (rating: number): RatingCategory => {
  if (rating <= 2) return 'trial'
  if (rating <= 4) return 'greedy'
  if (rating <= 6) return 'drinkable'
  if (rating <= 8) return 'good'
  return 'bliss'
}
// Хелпер - получаем эмодзи по категории
export const getRatingEmoji = (category: RatingCategory): string => {
  const map: Record<RatingCategory, string> = {
    trial:     '🤢',
    greedy:    '😬',
    drinkable: '😐',
    good:      '🙂',
    bliss:     '😋',
  }
  return map[category]
}

// Хелпер - получаем label по категории
export const getRatingLabel = (category: RatingCategory): string => {
  const map: Record<RatingCategory, string> = {
    'trial':   'Испытание',
    'greedy': 'Допить из жадности',
    'drinkable':  'Пить можно',
    'good':     'Хороший экземпляр',
    'bliss':  'Блаженство',
  }
  return map[category]
}

// Запись в дневнике
export interface DiaryEntry {
  id: string                    // id
  userId: string                // id пользователя из Supabase
  beerId: number | string       // id напитка из Punk API или Supabase
  beerName: string              // название, сохраняем чтобы не зависеть от API
  beerImage?: string            // фото, тоже сохраняем

  rating: number                // оценка 0-10
  ratingCategory: RatingCategory // определяется автоматически из rating

  userType?: BeerType           // тип (который пользователь присвоит сам) заготовка на будущее!!!
  userStyle?: BeerStyle         // стиль (который пользователь присвоит сам) заготовка на будущее!!!

  note?: string                 // личная заметка пользователя

  createdAt: string             // дата добавления
  updatedAt: string             // дата последнего изменения
}