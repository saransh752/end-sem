import React from 'react'

/**
 * Reusable loading skeleton for cards.
 * `lines` prop controls how many text lines to show.
 */
export function CardSkeleton({ lines = 3, hasImage = false }) {
  return (
    <div className="glass-card p-4 space-y-3">
      {hasImage && <div className="skeleton h-40 w-full rounded-lg" />}
      <div className="skeleton h-4 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

/**
 * Stat card skeleton
 */
export function StatSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-8 w-32" />
      <div className="skeleton h-3 w-20" />
    </div>
  )
}

/**
 * Full-width chart skeleton
 */
export function ChartSkeleton({ height = 200 }) {
  return (
    <div className="glass-card p-4">
      <div className="skeleton h-4 w-48 mb-4" />
      <div className="skeleton w-full rounded-lg" style={{ height }} />
    </div>
  )
}
