'use client'

import { IconBeerFilled, IconChevronRight } from '@tabler/icons-react'
import type { Beer } from '@/types/beer'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { generateSlug } from '@/lib/utils'

interface BeerCardProps {
  beer: Beer
}

export default function BeerCard({ beer }: BeerCardProps) {
  const router = useRouter()
  const locale = useLocale()

  const handleClick = () => {
    const slug = generateSlug(beer.name, beer.id)
    router.push(`/${locale}/beer/${slug}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left"
      style={{ background: 'transparent' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Фото или заглушка */}
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0 overflow-hidden"
        style={{
          width: '52px',
          height: '52px',
          background: beer.image_url ? 'var(--surface)' : 'var(--background)',
          border: beer.image_url ? 'none' : '1px solid var(--border)',
        }}
      >
        {beer.image_url ? (
          <img
            src={beer.image_url}
            alt={beer.name}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <IconBeerFilled size={22} style={{ color: 'var(--muted)' }} />
        )}
      </div>

      {/* Название и описание */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] font-medium truncate"
          style={{ color: 'var(--foreground)' }}
        >
          {beer.name}
        </p>
        {beer.tagline && (
          <p
            className="text-[13px] truncate mt-0.5"
            style={{ color: 'var(--muted)' }}
          >
            {beer.tagline}
          </p>
        )}
      </div>

      {/* Крепость */}
      {beer.abv !== undefined && (
        <span
          className="text-[13px] font-medium flex-shrink-0"
          style={{ color: 'var(--color-brand-amber)' }}
        >
          {beer.abv}%
        </span>
      )}

      <IconChevronRight size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
    </button>
  )
}