'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { diaryRepository } from '@/lib/diary'
import type { DiaryEntry } from '@/lib/diary'
import { getRatingEmoji } from '@/types/diary'
import DeleteConfirmModal from '@/components/diary/DeleteConfirmModal'
import { IconPhoto, IconNotebook, IconTrash } from '@tabler/icons-react'

export default function DiaryPage() {
  const t = useTranslations('diary')
  const router = useRouter()
  const authStatus = useAppSelector(state => state.auth.status)

  const [entries, setEntries] = useState<DiaryEntry[] | null>(null)
  const [entryToDelete, setEntryToDelete] = useState<DiaryEntry | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (authStatus === 'authenticated') {
      diaryRepository.getAll().then(setEntries)
    }
  }, [authStatus])

  const handleDeleteClick = (e: React.MouseEvent, entry: DiaryEntry) => {
    e.stopPropagation() 
    setEntryToDelete(entry)
  }

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return
    setIsDeleting(true)

    try {
      await diaryRepository.remove(entryToDelete.id)
      setEntries(prev => prev?.filter(e => e.id !== entryToDelete.id) ?? null)
      setEntryToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <IconNotebook size={32} style={{ color: 'var(--muted)' }} className="mb-3" />
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
          {t('loginRequired')}
        </p>
        <button
          onClick={() => router.push('/profile')}
          className="px-5 py-2.5 rounded-lg text-sm font-medium"
          style={{ background: 'var(--color-brand-amber)', color: '#FFFFFF' }}
        >
          {t('goToLogin')}
        </button>
      </div>
    )
  }

  return (
    <div className="px-3 py-3 relative h-full">

      <h1 className="text-lg font-semibold px-2 mb-3" style={{ color: 'var(--foreground)' }}>
        {t('title')}
      </h1>

      {entries === null && (
        <div className="flex items-center justify-center h-40">
          <p style={{ color: 'var(--muted)' }}>···</p>
        </div>
      )}

      {entries?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-center px-6">
          <IconNotebook size={28} style={{ color: 'var(--muted)' }} />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('empty')}</p>
        </div>
      )}

      {entries?.map(entry => (
        <div
          key={entry.id}
          onClick={() => router.push(`/beer/${entry.beerId}`)}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg mb-2 text-left transition-colors cursor-pointer"
          style={{ border: '1px solid var(--border)' }}
        >
          <div
            className="flex items-center justify-center rounded-lg flex-shrink-0 overflow-hidden"
            style={{ width: '48px', height: '48px', background: 'var(--surface)' }}
          >
            {entry.beerImage ? (
              <img src={entry.beerImage} alt={entry.beerName} className="w-full h-full object-contain p-1" />
            ) : (
              <IconPhoto size={20} style={{ color: 'var(--muted)' }} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
              {entry.beerName}
            </p>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>
              {entry.note || t('noNote')}
            </p>
          </div>

          <div className="text-center flex-shrink-0">
            <p className="text-lg leading-none">{getRatingEmoji(entry.ratingCategory)}</p>
            <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--color-brand-amber)' }}>
              {entry.rating}/10
            </p>
          </div>

          <button
            onClick={(e) => handleDeleteClick(e, entry)}
            className="flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ width: '32px', height: '32px', color: '#DC2626' }}
          >
            <IconTrash size={16} />
          </button>
        </div>
      ))}

      {entryToDelete && (
        <DeleteConfirmModal
          beerName={entryToDelete.beerName}
          onCancel={() => setEntryToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}

    </div>
  )
}