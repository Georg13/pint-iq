'use client'

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface PaginationProps {
  page: number
  hasNextPage: boolean  
  onPageChange: (page: number) => void
}

export default function Pagination({ page, hasNextPage, onPageChange }: PaginationProps) {
  const isFirstPage = page <= 1

  return (
    <div className="flex items-center justify-center gap-4 py-4">

      <button
        onClick={() => onPageChange(page - 1)}
        disabled={isFirstPage}
        className="flex items-center justify-center rounded-lg transition-opacity"
        style={{
          width: '36px',
          height: '36px',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          opacity: isFirstPage ? 0.3 : 1,
        }}
      >
        <IconChevronLeft size={18} />
      </button>

      <span
        className="text-sm font-medium"
        style={{ color: 'var(--foreground)', minWidth: '24px', textAlign: 'center' }}
      >
        {page}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="flex items-center justify-center rounded-lg transition-opacity"
        style={{
          width: '36px',
          height: '36px',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          opacity: !hasNextPage ? 0.3 : 1,
        }}
      >
        <IconChevronRight size={18} />
      </button>

    </div>
  )
}