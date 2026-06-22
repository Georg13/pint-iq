// Источник данных
export type BeerSource = 'punk_api' | 'supabase' | 'manual'

// Категории крепости
export type StrengthCategory =
  | 'light'    // лёгкое - до 4%
  | 'medium'   // среднее - от 4% до 7%
  | 'strong'   // крепкое - от 7% и выше

// Вкусовой профиль напитка(все значения по шкале от 1 до 5)
export interface TasteProfile {
  sweetness?: number    // сладость (1-совсем сухое, 5-очень сладкое)
  bitterness?: number   // горечь (1-мягкое, 5-очень горькое)
  body?: number         // плотность/тело (1-лёгкое водянистое, 5-густое насыщенное)
  aroma?: number        // аромат (1-нейтральный, 5-очень ароматное)
}

// Состав напитка - упрощённый
export interface BeerIngredients {
  malt?: string[]       // солод - даёт цвет, сладость и тело. Например: ["Pale Malt", "Caramel Malt"]
  hops?: string[]       // хмель - даёт горечь и аромат. Например: ["Chinook", "Simcoe"]
  yeast?: string        // дрожжи - отвечают за брожение и вкус. Например: "American Ale Yeast"
  extras?: string[]     // дополнительные добавки - фрукты, специи и т.д. Например: ["Манго", "Кориандр"]
}

// Основной тип напитка
export interface Beer {
  id: number | string       // уникальный идентификатор (number для Punk API, string/uuid для Supabase)
  name: string              // название сорта. Например: "Punk IPA"
  tagline?: string          // слоган или подзаголовок. Например: "Post Modern Classic"
  description?: string      // описание 
  image_url?: string        // ссылка на фото
  style?: string            // тип напитка. Например: "IPA", "Stout", "Porter", "Pale Ale"

  // Технические характеристики
  abv?: number              // крепость в % 
  ibu?: number              // горечь 
  ebc?: number              // цвет

  // Вкусовой профиль (шкала 1-5)
  taste_profile?: TasteProfile

  // Состав
  ingredients?: BeerIngredients

  // Дополнительная информация
  first_brewed?: string     // когда впервые сварен этот сорт.
  food_pairing?: string[]   // с чем хорошо сочетается
  brewers_tips?: string     // совет от пивовара

  // Служебное поле
  _source?: BeerSource
}

// Фильтры для поиска и пагинации
export interface BeerFilters {
  search?: string   // строка поиска по названию
  page?: number      // номер страницы
  perPage?: number   // количество на странице
}