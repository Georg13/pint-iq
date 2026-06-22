'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { barsRepository, getMapUrl } from '@/lib/bars'
import type { Bar } from '@/lib/bars'
import BarFormModal from '@/components/bars/BarFormModal'
import DeleteConfirmModal from '@/components/diary/DeleteConfirmModal'
import {
  IconBuilding,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconMapPin,
  IconTrash,
} from '@tabler/icons-react'
import MapChoiceModal from '@/components/bars/MapChoiceModal'

export default function BarsPage() {
  const t = useTranslations('bars')
  const router = useRouter()
  const authStatus = useAppSelector(state => state.auth.status)

  const [bars, setBars] = useState<Bar[] | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [barToDelete, setBarToDelete] = useState<Bar | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [barForMap, setBarForMap] = useState<Bar | null>(null)

  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')

  const loadBars = () => {
    barsRepository.getAll().then(setBars)
  }

  useEffect(() => {
    if (authStatus === 'authenticated') loadBars()
  }, [authStatus])

  const countries = useMemo(() => {
    if (!bars) return []
    return Array.from(new Set(bars.map(b => b.country))).sort()
  }, [bars])

  const cities = useMemo(() => {
    if (!bars) return []
    const filtered = selectedCountry
      ? bars.filter(b => b.country === selectedCountry)
      : bars
    return Array.from(new Set(filtered.map(b => b.city))).sort()
  }, [bars, selectedCountry])

  const filteredBars = useMemo(() => {
    if (!bars) return []
    return bars.filter(b =>
      (!selectedCountry || b.country === selectedCountry) &&
      (!selectedCity || b.city === selectedCity)
    )
  }, [bars, selectedCountry, selectedCity])

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
    setSelectedCity('')
  }

  const handleConfirmDelete = async () => {
    if (!barToDelete) return
    setIsDeleting(true)
    try {
      await barsRepository.remove(barToDelete.id)
      setBars(prev => prev?.filter(b => b.id !== barToDelete.id) ?? null)
      setBarToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <IconBuilding size={32} style={{ color: 'var(--muted)' }} className="mb-3" />
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{t('loginRequired')}</p>
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
    <div className="flex flex-col h-full">

      <div className="flex-shrink-0 px-3 pt-3 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-2 mb-3">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            {t('title')}
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'var(--color-brand-amber)', color: '#FFFFFF' }}
          >
            <IconPlus size={16} />
            {t('add')}
          </button>
        </div>

        {bars && bars.length > 0 && (
          <div className="flex gap-2 px-2">
            <select
              value={selectedCountry}
              onChange={e => handleCountryChange(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg text-xs outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="">{t('allCountries')}</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg text-xs outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <option value="">{t('allCities')}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 relative">

        {bars === null && (
          <div className="flex items-center justify-center h-40">
            <p style={{ color: 'var(--muted)' }}>···</p>
          </div>
        )}

        {bars?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-center px-6">
            <IconBuilding size={28} style={{ color: 'var(--muted)' }} />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('empty')}</p>
          </div>
        )}

        {filteredBars.map(bar => (
          <div
            key={bar.id}
            className="p-3 rounded-lg mb-2"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                  {bar.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {bar.city}, {bar.country}
                </p>
              </div>
              <button onClick={() => setBarToDelete(bar)} style={{ color: '#DC2626', flexShrink: 0 }}>
                <IconTrash size={16} />
              </button>
            </div>

            {bar.rating !== undefined && (
              <div className="flex gap-0.5 mb-1.5">
                {[1, 2, 3, 4, 5].map(star =>
                  star <= bar.rating! ? (
                    <IconStarFilled key={star} size={14} style={{ color: 'var(--color-brand-amber)' }} />
                  ) : (
                    <IconStar key={star} size={14} style={{ color: 'var(--border)' }} />
                  )
                )}
              </div>
            )}

            {bar.comment && (
              <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{bar.comment}</p>
            )}
              {(bar.address || (bar.latitude && bar.longitude)) && (
                <button
                  onClick={() => setBarForMap(bar)}
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: '#2563EB' }}
                >
                  <IconMapPin size={14} />
                  {t('openInMaps')}
                </button>
              )}
          </div>
        ))}

      </div>

      {showForm && (
        <BarFormModal
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadBars() }}
        />
      )}

      {barToDelete && (
        <DeleteConfirmModal
          beerName={barToDelete?.name ?? ''}
          onCancel={() => setBarToDelete(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {barForMap && (
        <MapChoiceModal
          bar={barForMap}
          onClose={() => setBarForMap(null)}
        />
      )}
    </div>
  )
}