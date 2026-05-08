import React, { useMemo } from 'react'

// Generates a field of stars with random positions, sizes, and twinkle delays
export default function StarBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5,
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.7 + 0.2,
    }))
  }, [])

  return (
    <div className="stars-container" aria-hidden="true">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            '--duration': star.duration,
            '--delay': star.delay,
          }}
        />
      ))}
      {/* Nebula glow blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '600px', height: '600px',
          top: '10%', left: '-10%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '800px', height: '800px',
          bottom: '-20%', right: '-15%',
          background: 'radial-gradient(circle, rgba(155,89,255,0.05) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
