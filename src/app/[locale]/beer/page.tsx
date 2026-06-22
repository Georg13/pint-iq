'use client'

import { useTranslations } from 'next-intl'
import { useGetBeersQuery } from '@/features/beer/beerApi'
import BeerCard from '@/components/ui/BeerCard'
import Pagination from '@/components/ui/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { IconArrowLeft, IconMoodSad } from '@tabler/icons-react'

export default function BeerListPage() {
  const t = useTranslations('beer')
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()

  const search = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')
  const perPage = 20

  const { data: beers, isLoading, isError } = useGetBeersQuery(
    { search, page, perPage },
    { skip: !search }
  )

  // Меняем номер страницы и обновляем URL
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`/${locale}/beer?${params.toString()}`)
  }

  const hasNextPage = (beers?.length ?? 0) === perPage

  return (
    <div className="flex flex-col h-full">

      <div
        className="flex items-center gap-3 px-5 pt-4 pb-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <button onClick={() => router.push(`/${locale}`)}>
          <IconArrowLeft size={20} style={{ color: 'var(--foreground)' }} />
        </button>
        <div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {t('searchResultsFor')}
          </p>
          <p className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
            &ldquo;{search}&rdquo;
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3">

        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <p style={{ color: 'var(--muted)' }}>{t('loading')}</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <p style={{ color: 'var(--muted)' }}>{t('loadError')}</p>
          </div>
        )}

        {!isLoading && !isError && beers?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <IconMoodSad size={32} style={{ color: 'var(--muted)' }} />
            <p style={{ color: 'var(--muted)' }}>{t('notFound')}</p>
          </div>
        )}

        {beers?.map(beer => (
          <BeerCard key={beer.id} beer={beer} />
        ))}

        {/* Пагинация */}
        {!isLoading && !isError && beers && beers.length > 0 && (
          <Pagination
            page={page}
            hasNextPage={hasNextPage}
            onPageChange={handlePageChange}
          />
        )}

      </div>
    </div>
  )
}