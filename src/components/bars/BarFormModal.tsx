'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { barsRepository } from '@/lib/bars'
import { IconX, IconMapPin, IconStar, IconStarFilled } from '@tabler/icons-react'

interface BarFormModalProps {
  onClose: () => void
  onSaved: () => void
}

// Структура ответа Nominatim
interface NominatimAddress {
  road?: string
  house_number?: string
  city?: string
  town?: string        
  village?: string     
  country?: string
}

interface GeocodeResult {
  address: string    // короткий  адрес
  city: string
  country: string
}

const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'PintIQ-App/1.0',
        },
      }
    )
    const data = await response.json()
    const addr: NominatimAddress = data.address ?? {}

    // Собираем короткий адрес из дома + улицы
    const addressParts = [addr.house_number, addr.road].filter(Boolean)
    const shortAddress = addressParts.join(', ')

    // Город
    const city = addr.city ?? addr.town ?? addr.village ?? ''

    return {
      address: shortAddress,
      city,
      country: addr.country ?? '',
    }
  } catch {
    return null
  }
}

export default function BarFormModal({ onClose, onSaved }: BarFormModalProps) {
  const t = useTranslations('bars')

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid = name.trim() && country.trim() && city.trim()

  const handleGetLocation = () => {
    if (!navigator.geolocation) return
    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setCoords({ lat, lng })

        const result = await reverseGeocode(lat, lng)
        if (result) {
          if (result.address) setAddress(result.address)
          if (result.city) setCity(result.city)
          if (result.country) setCountry(result.country)
        }

        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
      }
    )
  }

  const handleSave = async () => {
    if (!isValid) return
    setIsSaving(true)
    setError(null)

    try {
      await barsRepository.create({
        name: name.trim(),
        country: country.trim(),
        city: city.trim(),
        address: address.trim() || undefined,
        latitude: coords?.lat,
        longitude: coords?.lng,
        rating: rating > 0 ? rating : undefined,
        comment: comment.trim() || undefined,
      })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setIsSaving(false)
    }
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
            {t('addTitle')}
          </h2>
          <button onClick={onClose}>
            <IconX size={20} style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-4">

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>{t('name')} *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>{t('country')} *</label>
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder={t('countryPlaceholder')}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>{t('city')} *</label>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder={t('cityPlaceholder')}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>{t('address')}</label>
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={t('addressPlaceholder')}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-opacity"
            style={{
              border: '1px solid var(--border)',
              color: coords ? '#16A34A' : 'var(--foreground)',
              opacity: isLocating ? 0.6 : 1,
            }}
          >
            <IconMapPin size={16} />
            {isLocating ? '...' : coords ? t('locationDetected') : t('getLocation')}
          </button>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--muted)' }}>{t('rating')}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star === rating ? 0 : star)}>
                  {star <= rating ? (
                    <IconStarFilled size={24} style={{ color: 'var(--color-brand-amber)' }} />
                  ) : (
                    <IconStar size={24} style={{ color: 'var(--border)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>{t('comment')}</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={t('commentPlaceholder')}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

        </div>

        {error && <p className="text-xs mb-3" style={{ color: '#DC2626' }}>{error}</p>}

        <button
          onClick={handleSave}
          disabled={!isValid || isSaving}
          className="w-full py-3 rounded-xl font-medium text-sm transition-opacity"
          style={{
            background: 'var(--color-brand-amber)',
            color: '#FFFFFF',
            opacity: (!isValid || isSaving) ? 0.5 : 1,
          }}
        >
          {isSaving ? '...' : t('save')}
        </button>
      </div>
    </div>
  )
}