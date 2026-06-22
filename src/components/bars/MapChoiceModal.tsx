'use client'

import { useTranslations } from 'next-intl'
import { getMapUrl } from '@/lib/bars'
import type { Bar } from '@/lib/bars'
import { IconX } from '@tabler/icons-react'

interface MapChoiceModalProps {
  bar: Bar
  onClose: () => void
}

export default function MapChoiceModal({ bar, onClose }: MapChoiceModalProps) {
  const t = useTranslations('bars')

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl p-5"
        style={{ background: 'var(--background)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            {t('chooseMapApp')}
          </p>
          <button onClick={onClose}>
            <IconX size={18} style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={getMapUrl(bar, 'google')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center py-3 rounded-xl text-sm font-medium"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            Google Maps
          </a>
          <a
            href={getMapUrl(bar, 'yandex')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center py-3 rounded-xl text-sm font-medium"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            Яндекс Карты
          </a>
        </div>
      </div>
    </div>
  )
}