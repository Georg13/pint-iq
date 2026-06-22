import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Beer, BeerFilters } from '@/types/beer'

const BASE_URL = 'https://punkapi-alxiw.amvera.io/v3/'

// Тип возвращаемый PunkAPI v3
interface PunkApiBeer {
  id: number
  name: string
  tagline: string
  description: string
  image: string | null   
  abv: number
  ibu: number | null
  ebc: number | null
  first_brewed: string
  food_pairing: string[]
  brewers_tips: string
  ingredients: {
    malt: { name: string; amount: { value: number; unit: string } }[]
    hops: { name: string; amount: { value: number; unit: string }; add: string; attribute: string }[]
    yeast: string
  }
}

// Собираем полный URL картинки из имени файла
const buildImageUrl = (filename: string | null): string | undefined => {
  if (!filename) return undefined
  return `${BASE_URL}images/${filename}`
}

// Трансформируем сырые данные API в тип Beer
const transformBeer = (raw: PunkApiBeer): Beer => ({
  id: raw.id,
  name: raw.name,
  tagline: raw.tagline,
  description: raw.description,
  image_url: buildImageUrl(raw.image),
  abv: raw.abv,
  ibu: raw.ibu ?? undefined,
  ebc: raw.ebc ?? undefined,
  first_brewed: raw.first_brewed,
  food_pairing: raw.food_pairing,
  brewers_tips: raw.brewers_tips,

  ingredients: {
    malt: raw.ingredients.malt.map(m => m.name),
    hops: raw.ingredients.hops.map(h => h.name),
    yeast: raw.ingredients.yeast,
  },

  _source: 'punk_api',
})

export const beerApi = createApi({
  reducerPath: 'beerApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({

    getBeers: builder.query<Beer[], BeerFilters>({
      query: ({ search, page = 1, perPage = 20 }) => ({
        url: 'beers',
        params: {
          page,
          per_page: perPage,
          ...(search ? { beer_name: search } : {}),
        },
      }),
      transformResponse: (raw: PunkApiBeer[]) => raw.map(transformBeer),
    }),

    getBeerById: builder.query<Beer, { id: string }>({
      query: ({ id }) => `beers/${id}`,
      //по id возвращает объект
      transformResponse: (raw: PunkApiBeer) => transformBeer(raw),
    }),

  }),
})

export const { useGetBeersQuery, useGetBeerByIdQuery } = beerApi