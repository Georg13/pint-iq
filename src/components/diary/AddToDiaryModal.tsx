'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { diaryRepository } from '@/lib/diary'
import type { DiaryEntry } from '@/lib/diary'
import { getRatingEmoji, getRatingCategory } from '@/types/diary'
import { IconX } from '@tabler/icons-react'
import type { Beer } from '@/types/beer'

interface AddToDiaryModalProps {
  beer: Beer
  onClose: () => void
  onSaved: () => void
}

export default function AddToDiaryModal({ beer, onClose, onSaved }: AddToDiaryModalProps) {
  const t = useTranslations('diary')

  const [existingEntry, setExistingEntry] = useState<DiaryEntry | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  const [rating, setRating] = useState(5)
  const [note, setNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // При открытии модалки проверяем есть ли уже запись для этого напитка
  useEffect(() => {
    diaryRepository.getByBeerId(String(beer.id)).then(entry => {
      if (entry) {
        setExistingEntry(entry)
        setRating(entry.rating)
        setNote(entry.note ?? '')
      }
      setIsChecking(false)
    })
  }, [beer.id])

  const category = getRatingCategory(rating)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      if (existingEntry) {
        // Если есть запись, обновляем её
        await diaryRepository.update(existingEntry.id, {
          rating,
          note: note.trim() || undefined,
        })
      } else {
        // Новая запись
        await diaryRepository.create({
          beerId: String(beer.id),
          beerName: beer.name,
          beerImage: beer.image_url,
          rating,
          note: note.trim() || undefined,
        })
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="absolute inset-0 flex items-start justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
            className="w-full rounded-2xl p-5 mt-20"
            style={{ background: 'var(--background)', minHeight: '360px', maxWidth: 'calc(430px - 32px)' }}
            onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
            {beer.name}
          </h2>
          <button onClick={onClose}>
            <IconX size={20} style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        {isChecking ? (
          <div className="py-8 text-center">
            <p style={{ color: 'var(--muted)' }}>···</p>
          </div>
        ) : (
          <>
            {existingEntry && (
              <p className="text-xs mb-4 text-center" style={{ color: 'var(--muted)' }}>
                {t('alreadyInDiary')}
              </p>
            )}

            <div className="text-center mb-5">
              <p className="text-4xl mb-2">{getRatingEmoji(category)}</p>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                {rating}/10
              </p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {t(`ratingCategory.${category}`)}
              </p>
            </div>

            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              className="w-full mb-5"
              style={{ accentColor: 'var(--color-brand-amber)' }}
            />

            <div className="mb-5">
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>
                {t('note')}
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={t('notePlaceholder')}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            {error && (
              <p className="text-xs mb-3" style={{ color: '#DC2626' }}>{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3 rounded-xl font-medium text-sm transition-opacity"
              style={{
                background: 'var(--color-brand-amber)',
                color: '#FFFFFF',
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? '...' : t('save')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}