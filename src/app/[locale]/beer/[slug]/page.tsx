'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useGetBeerByIdQuery } from '@/features/beer/beerApi'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { getIdFromSlug, translateText, translateMany } from '@/lib/utils'
import { diaryRepository } from '@/lib/diary'
import AddToDiaryModal from '@/components/diary/AddToDiaryModal'
import {
  IconArrowLeft,
  IconPhoto,
  IconWheat,
  IconLeaf,
  IconCircleDot,
  IconNotebook,
  IconLanguage,
  IconCheck,
} from '@tabler/icons-react'
import { useLocale } from 'next-intl'

interface TranslatedContent {
  description?: string
  foodPairing?: string[]
  malt?: string[]
  hops?: string[]
  yeast?: string
  brewersTips?: string
}

export default function BeerDetailPage() {
  const t = useTranslations('beer')
  const router = useRouter()
  const params = useParams<{ slug: string }>()

  const authStatus = useAppSelector(state => state.auth.status)
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [isInDiary, setIsInDiary] = useState<boolean | null>(null)

  const id = getIdFromSlug(params.slug)
  const { data: beer, isLoading, isError } = useGetBeerByIdQuery({ id })

  const locale = useLocale()
  const [translated, setTranslated] = useState<TranslatedContent | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = async () => {
    if (!beer) return

    // Уже переведено — переключаемся обратно к оригиналу
    if (translated) {
      setTranslated(null)
      return
    }

    setIsTranslating(true)
    const lang = locale as 'ru' | 'en'

    // Запускаем все переводы параллельно
    const [description, foodPairing, malt, hops, yeast, brewersTips] = await Promise.all([
      beer.description ? translateText(beer.description, lang) : Promise.resolve(undefined),
      beer.food_pairing?.length ? translateMany(beer.food_pairing, lang) : Promise.resolve(undefined),
      beer.ingredients?.malt?.length ? translateMany(beer.ingredients.malt, lang) : Promise.resolve(undefined),
      beer.ingredients?.hops?.length ? translateMany(beer.ingredients.hops, lang) : Promise.resolve(undefined),
      beer.ingredients?.yeast ? translateText(beer.ingredients.yeast, lang) : Promise.resolve(undefined),
      beer.brewers_tips ? translateText(beer.brewers_tips, lang) : Promise.resolve(undefined),
    ])

    setTranslated({
      description: description ?? undefined,
      foodPairing,
      malt,
      hops,
      yeast: yeast ?? undefined,
      brewersTips: brewersTips ?? undefined,
    })
    setIsTranslating(false)
  }

  // Проверяем сразу при загрузке страницы — записан ли напиток в дневнике
  useEffect(() => {
    if (authStatus === 'authenticated' && beer) {
      diaryRepository.getByBeerId(String(beer.id)).then(entry => {
        setIsInDiary(!!entry)
      })
    } else if (authStatus === 'unauthenticated') {
      const timer = setTimeout(() => setIsInDiary(false), 0)
      return () => clearTimeout(timer)
    }
  }, [authStatus, beer])

  const handleAddToDiaryClick = () => {
    if (authStatus !== 'authenticated') {
      router.push('/profile')
      return
    }
    setShowDiaryModal(true)
  }

  const handleSaved = () => {
    setShowDiaryModal(false)
    setIsInDiary(true)
  }

  return (
    <div className="flex flex-col h-full">

      <div className="flex items-center px-5 pt-4 pb-2 flex-shrink-0">
        <button onClick={() => router.back()}>
          <IconArrowLeft size={20} style={{ color: 'var(--foreground)' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-6">

        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <p style={{ color: 'var(--muted)' }}>{t('loading')}</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-40">
            <p style={{ color: 'var(--muted)' }}>{t('loadError')}</p>
          </div>
        )}

        {beer && (
          <>
            <div className="flex flex-col items-center text-center mb-5">
              <div
                className="flex items-center justify-center rounded-2xl mb-3 overflow-hidden relative"
                style={{ width: '100px', height: '100px', background: 'var(--surface)' }}
              >
                {beer.image_url ? (
                  <img src={beer.image_url} alt={beer.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <IconPhoto size={32} style={{ color: 'var(--muted)' }} />
                )}

                {isInDiary && (
                  <div
                    className="absolute top-1 right-1 flex items-center justify-center rounded-full"
                    style={{ width: '22px', height: '22px', background: 'var(--color-brand-amber)' }}
                  >
                    <IconCheck size={13} style={{ color: '#FFFFFF' }} />
                  </div>
                )}
              </div>

              {beer.style && (
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-md mb-2"
                  style={{ background: '#FEF3C7', color: '#92400E' }}
                >
                  {beer.style}
                </span>
              )}

              <h1 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                {beer.name}
              </h1>

              {beer.tagline && (
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  {beer.tagline}
                </p>
              )}
            </div>

            {(beer.abv !== undefined || beer.ibu !== undefined || beer.ebc !== undefined) && (
              <div className="grid grid-cols-3 gap-2 mb-5">
                {beer.abv !== undefined && (
                  <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--surface)' }}>
                    <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>{t('abv')}</p>
                    <p className="text-base font-semibold" style={{ color: 'var(--color-brand-amber)' }}>{beer.abv}%</p>
                  </div>
                )}
                {beer.ibu !== undefined && (
                  <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--surface)' }}>
                    <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>{t('ibu')}</p>
                    <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{beer.ibu}</p>
                  </div>
                )}
                {beer.ebc !== undefined && (
                  <div className="rounded-lg p-2.5 text-center" style={{ background: 'var(--surface)' }}>
                    <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>{t('ebc')}</p>
                    <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{beer.ebc}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleAddToDiaryClick}
              disabled={isInDiary === null}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium mb-3 transition-opacity"
              style={{
                background: isInDiary ? 'var(--surface)' : 'var(--color-brand-amber)',
                color: isInDiary ? 'var(--foreground)' : '#FFFFFF',
                border: isInDiary ? '1px solid var(--border)' : 'none',
                opacity: isInDiary === null ? 0.6 : 1,
              }}
            >
              {isInDiary === null ? (
                <>···</>
              ) : isInDiary ? (
                <>
                  <IconCheck size={18} />
                  {t('editInDiary')}
                </>
              ) : (
                <>
                  <IconNotebook size={18} />
                  {t('addToDiary')}
                </>
              )}
            </button>

            {/* Кнопка перевода всей карточки */}
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm mb-6 transition-opacity"
              style={{ border: '1px solid var(--border)', color: 'var(--foreground)', opacity: isTranslating ? 0.5 : 1 }}
            >
              <IconLanguage size={16} />
              {isTranslating ? '...' : translated ? t('showOriginal') : t('translateAll')}
            </button>

            {beer.description && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  {t('description')}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {translated?.description ?? beer.description}
                </p>
              </div>
            )}

            {beer.food_pairing && beer.food_pairing.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  {t('foodPairing')}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {(translated?.foodPairing ?? beer.food_pairing).map((food, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1.5 rounded-md"
                      style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {beer.ingredients && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  {t('ingredients')}
                </h2>
                <div className="rounded-xl p-3 flex flex-col gap-3" style={{ border: '1px solid var(--border)' }}>
                  {beer.ingredients.malt && beer.ingredients.malt.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: '28px', height: '28px', background: 'var(--surface)' }}>
                        <IconWheat size={15} style={{ color: 'var(--muted)' }} />
                      </div>
                      <div>
                        <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>{t('malt')}</p>
                        <p className="text-xs" style={{ color: 'var(--foreground)' }}>
                          {(translated?.malt ?? beer.ingredients.malt).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                  {beer.ingredients.hops && beer.ingredients.hops.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: '28px', height: '28px', background: 'var(--surface)' }}>
                        <IconLeaf size={15} style={{ color: 'var(--muted)' }} />
                      </div>
                      <div>
                        <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>{t('hops')}</p>
                        <p className="text-xs" style={{ color: 'var(--foreground)' }}>
                          {(translated?.hops ?? beer.ingredients.hops).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                  {beer.ingredients.yeast && (
                    <div className="flex items-start gap-2.5">
                      <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: '28px', height: '28px', background: 'var(--surface)' }}>
                        <IconCircleDot size={15} style={{ color: 'var(--muted)' }} />
                      </div>
                      <div>
                        <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>{t('yeast')}</p>
                        <p className="text-xs" style={{ color: 'var(--foreground)' }}>
                          {translated?.yeast ?? beer.ingredients.yeast}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {beer.brewers_tips && (
              <div className="mb-2">
                <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  {t('brewersTips')}
                </h2>
                <p className="text-sm leading-relaxed italic" style={{ color: 'var(--muted)' }}>
                  {translated?.brewersTips ?? beer.brewers_tips}
                </p>
              </div>
            )}
          </>
        )}

      </div>

      {showDiaryModal && beer && (
        <AddToDiaryModal
          beer={beer}
          onClose={() => setShowDiaryModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}