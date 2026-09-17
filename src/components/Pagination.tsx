'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Loader2, ArrowDown } from 'lucide-react';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
  mode?: 'pages' | 'infinite' | 'both';
  onLoadMore?: () => void;
  loading?: boolean;
  itemLabel?: string;
}

export default function Pagination({
  meta,
  onPageChange,
  onLimitChange,
  mode = 'pages',
  onLoadMore,
  loading = false,
  itemLabel = 'items',
}: PaginationProps) {
  const { page, limit, total, totalPages, hasNextPage, hasPrevPage } = meta;

  if (total === 0) return null;

  const startItem = Math.min((page - 1) * limit + 1, total);
  const endItem = Math.min(page * limit, total);
  const isHasNext = hasNextPage !== undefined ? hasNextPage : page < totalPages;
  const isHasPrev = hasPrevPage !== undefined ? hasPrevPage : page > 1;

  // Build page numbers array with ellipsis for clean UI
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Infinite Scroll / Load More Button Mode */}
      {(mode === 'infinite' || mode === 'both') && isHasNext && (
        <div style={{ textAlign: 'center', margin: '16px 0 8px 0' }}>
          <button
            onClick={onLoadMore || (() => onPageChange(page + 1))}
            disabled={loading}
            className="btn btn-outline"
            style={{ padding: '12px 32px', borderRadius: '30px', fontSize: '14px', margin: '0 auto' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Loading more...
              </>
            ) : (
              <>
                <ArrowDown size={16} /> Load More {itemLabel}
              </>
            )}
          </button>
        </div>
      )}

      {/* Pages Controls Bar */}
      {(mode === 'pages' || mode === 'both') && (
        <div className="pagination-wrapper">
          <div className="pagination-info">
            Showing <strong style={{ color: 'var(--color-dark)' }}>{startItem}</strong> -{' '}
            <strong style={{ color: 'var(--color-dark)' }}>{endItem}</strong> of{' '}
            <strong style={{ color: 'var(--color-dark)' }}>{total}</strong> {itemLabel}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {onLimitChange && (
              <div className="pagination-limit-select">
                <span>Per page:</span>
                <select
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            )}

            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => onPageChange(page - 1)}
                disabled={!isHasPrev || loading}
                title="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>

              {getPageNumbers().map((p, idx) => (
                <button
                  key={idx}
                  className={`pagination-btn ${p === page ? 'active' : ''}`}
                  onClick={() => typeof p === 'number' && onPageChange(p)}
                  disabled={typeof p !== 'number' || loading}
                >
                  {p}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => onPageChange(page + 1)}
                disabled={!isHasNext || loading}
                title="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
