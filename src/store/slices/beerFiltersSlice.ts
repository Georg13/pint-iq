import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { BeerFilters } from '@/types/beer'

const initialState: BeerFilters = {
  search: '',   // поиск пустой
  page: 1,      // первая страница
  perPage: 20,  // 20 напитков на странице
}

const beerFiltersSlice = createSlice({
  name: 'beerFilters',
  initialState,
  reducers: {

    // Обновить строку поиска
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.page = 1  // сбрасываем страницу
    },

    // Перейти на другую страницу
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },

    // Сбросить всё
    resetFilters: () => initialState,
  },
})

export const { setSearch, setPage, resetFilters } = beerFiltersSlice.actions
export default beerFiltersSlice.reducer