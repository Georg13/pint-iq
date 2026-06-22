'use client'

import { useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createWorker } from 'tesseract.js'
import { IconX, IconCamera, IconPhoto, IconSearch } from '@tabler/icons-react'

interface PhotoSearchModalProps {
  onClose: () => void
}

export default function PhotoSearchModal({ onClose }: PhotoSearchModalProps) {
  const t = useTranslations('home')
  const router = useRouter()
  const locale = useLocale()

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleFileSelected = async (file: File) => {
    setError(null)
    setRecognizedText('')

    // Показываем превью, пока распознаём
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    setIsRecognizing(true)

    try {
      // поддержка английского и русского текста
      const worker = await createWorker(['eng', 'rus'])
      const { data } = await worker.recognize(file)
      await worker.terminate()

      const cleanText = data.text.trim()

      if (!cleanText) {
        setError(t('recognitionFailed'))
      } else {
        setRecognizedText(cleanText)
      }
    } catch {
      setError(t('recognitionFailed'))
    } finally {
      setIsRecognizing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelected(file)
  }

  const handleSearch = () => {
    if (!recognizedText.trim()) return
    onClose()
    router.push(`/${locale}/beer?q=${encodeURIComponent(recognizedText.trim())}`)
  }

  return (
    <div
      className="absolute inset-0 flex items-start justify-center z-50 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl p-5 mt-4 mb-4"
        style={{ background: 'var(--background)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
            {t('photoSearchTitle')}
          </h2>
          <button onClick={onClose}>
            <IconX size={20} style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Превью фото */}
        {imagePreview && (
          <div
            className="w-full rounded-xl overflow-hidden mb-4"
            style={{ maxHeight: '200px', background: 'var(--surface)' }}
          >
            <img src={imagePreview} alt="" className="w-full h-full object-contain" />
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            <IconCamera size={16} />
            {t('takePhoto')}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            <IconPhoto size={16} />
            {t('uploadPhoto')}
          </button>
        </div>

        {/* Статус распознавания */}
        {isRecognizing && (
          <div className="flex items-center justify-center py-6">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('recognizing')}</p>
          </div>
        )}

        {error && (
          <p className="text-xs mb-4" style={{ color: '#DC2626' }}>{error}</p>
        )}

        {/* Распознанный текст редактируемый перед поиском */}
        {recognizedText && !isRecognizing && (
          <div className="mb-4">
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>
              {t('recognizedText')}
            </label>
            <textarea
              value={recognizedText}
              onChange={e => setRecognizedText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {t('recognizedTextHint')}
            </p>
          </div>
        )}

        {recognizedText && !isRecognizing && (
          <button
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm"
            style={{ background: 'var(--color-brand-amber)', color: '#FFFFFF' }}
          >
            <IconSearch size={16} />
            {t('searchThis')}
          </button>
        )}

      </div>
    </div>
  )
}