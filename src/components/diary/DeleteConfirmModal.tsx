'use client'

import { useTranslations } from 'next-intl'
import { IconAlertTriangle } from '@tabler/icons-react'

interface DeleteConfirmModalProps {
  beerName: string
  onCancel: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export default function DeleteConfirmModal({
  beerName,
  onCancel,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  const t = useTranslations('diary')

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onCancel}
    >
      <div
        className="w-full rounded-2xl p-5 text-center"
        style={{ background: 'var(--background)' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-center rounded-full mx-auto mb-3"
          style={{ width: '48px', height: '48px', background: '#FEE2E2' }}
        >
          <IconAlertTriangle size={24} style={{ color: '#DC2626' }} />
        </div>

        <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          {t('deleteConfirmTitle')}
        </p>
        <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
          {t('deleteConfirmText', { name: beerName })}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity"
            style={{ background: '#DC2626', color: '#FFFFFF', opacity: isDeleting ? 0.6 : 1 }}
          >
            {isDeleting ? '...' : t('delete')}
          </button>
        </div>
      </div>
    </div>
  )
}