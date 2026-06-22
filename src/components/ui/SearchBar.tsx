'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import PhotoSearchModal from './PhotoSearchModal'
import { useSpeechRecognition } from '@/lib/useSpeechRecognition'
import {
  IconSearch,
  IconX,
  IconMicrophone,
  IconCamera,
} from '@tabler/icons-react'

export default function SearchBar() {
  const [showPhotoSearch, setShowPhotoSearch] = useState(false)
  const t = useTranslations('home')
  const router = useRouter()
  const locale = useLocale()
  const { isSupported, isListening, startListening } = useSpeechRecognition()

  const [value, setValue] = useState('')

  const handleSearch = () => {
    if (!value.trim()) return
    router.push(`/${locale}/beer?q=${encodeURIComponent(value.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleVoiceSearch = () => {
    if (!isSupported) return
    startListening((text) => {
      setValue(text)
    })
  }

  return (
    <div className="w-full flex flex-col gap-4">

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <button
          onClick={handleSearch}
          aria-label={t('searchButton')}
          className="flex items-center justify-center rounded-full transition-all"
          style={{
            width: '28px',
            height: '28px',
            background: value.trim() ? 'var(--color-brand-amber)' : 'transparent',
            color: value.trim() ? '#FFFFFF' : 'var(--muted)',
            flexShrink: 0,
          }}
        >
          <IconSearch size={16} />
        </button>

        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPlaceholder')}
          className="flex-1 bg-transparent outline-none text-base"
          style={{ color: 'var(--foreground)' }}
        />

        {value && (
          <button onClick={() => setValue('')} style={{ color: 'var(--muted)' }}>
            <IconX size={16} />
          </button>
        )}

        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

        <button
          onClick={handleVoiceSearch}
          disabled={!isSupported}
          className={`flex items-center justify-center rounded-full ${isListening ? 'animate-pulse' : ''}`}
          style={{
            width: '32px',
            height: '32px',
            background: isListening ? '#FCA5A5' : '#DBEAFE',
            border: 'none',
            flexShrink: 0,
            opacity: isSupported ? 1 : 0.4,
          }}
          aria-label={t('voiceSearch')}
        >
          <IconMicrophone size={16} style={{ color: isListening ? '#DC2626' : '#2563EB' }} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <span className="text-sm" style={{ color: 'var(--muted)' }}>{t('orDivider')}</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <button
        onClick={() => setShowPhotoSearch(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      >
        <span className="flex items-center justify-center rounded-full" style={{ width: '28px', height: '28px', background: '#DCFCE7' }}>
          <IconCamera size={15} style={{ color: '#16A34A' }} />
        </span>
        {t('photoSearch')}
      </button>


        {showPhotoSearch && (
          <PhotoSearchModal onClose={() => setShowPhotoSearch(false)} />
        )}
    </div>
  )
}