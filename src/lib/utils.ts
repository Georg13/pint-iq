// генерируем [slug]
export const generateSlug = (name: string, id: number | string): string => {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // убираем спецсимволы
    .replace(/\s+/g, '-')           // пробелы → дефисы
    .replace(/-+/g, '-')            // двойные дефисы → одинарные
    .trim()

  return `${nameSlug}-${id}`
}

// получаем id для запроса к Api "punk-ipa-1" → "1"
export const getIdFromSlug = (slug: string): string => {
  const parts = slug.split('-')
  return parts[parts.length - 1]
}


// Перевод текст MyMemory API 
export const translateText = async (
  text: string,
  targetLang: 'ru' | 'en'
): Promise<string | null> => {
  try {
    const sourceLang = targetLang === 'ru' ? 'en' : 'ru'
    const langPair = `${sourceLang}|${targetLang}`

    const params = new URLSearchParams({ q: text, langpair: langPair })
    const response = await fetch(`https://api.mymemory.translated.net/get?${params}`)
    const data = await response.json()

    if (data.responseStatus === 200) {
      return data.responseData.translatedText
    }
    return null
  } catch {
    return null
  }
}

// Переводим массив строк параллельно(для food_pairing, malt, hops и т.д.)
export const translateMany = async (
  texts: string[],
  targetLang: 'ru' | 'en'
): Promise<string[]> => {
  const results = await Promise.all(
    texts.map(text => translateText(text, targetLang))
  )
  // Если какой-то перевод не удался оставляем оригинал вместо него
  return results.map((translated, i) => translated ?? texts[i])
}