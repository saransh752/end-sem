import React, { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useISS } from '../context/ISSContext'

// Custom ISS SVG marker icon
const ISS_ICON = L.divIcon({
  className: 'iss-marker-icon',
  html: `<div style="
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    filter: drop-shadow(0 0 8px rgba(0,212,255,0.8));
    animation: issFloat 2s ease-in-out infinite;
  ">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="44" height="44">
      <!-- Solar panels left -->
      <rect x="2" y="20" width="12" height="8" rx="1" fill="#00d4ff" opacity="0.9"/>
      <rect x="2" y="20" width="12" height="8" rx="1" fill="none" stroke="#00ffcc" stroke-width="0.5"/>
      <line x1="14" y1="24" x2="18" y2="24" stroke="#00d4ff" stroke-width="1.5"/>
      <!-- Solar panels right -->
      <rect x="34" y="20" width="12" height="8" rx="1" fill="#00d4ff" opacity="0.9"/>
      <rect x="34" y="20" width="12" height="8" rx="1" fill="none" stroke="#00ffcc" stroke-width="0.5"/>
      <line x1="34" y1="24" x2="30" y2="24" stroke="#00d4ff" stroke-width="1.5"/>
      <!-- Main body -->
      <rect x="16" y="19" width="16" height="10" rx="2" fill="#9b59ff" opacity="0.95"/>
      <rect x="16" y="19" width="16" height="10" rx="2" fill="none" stroke="#00d4ff" stroke-width="1"/>
      <!-- Center dot -->
      <circle cx="24" cy="24" r="2.5" fill="#00ffcc"/>
      <!-- Top module -->
      <rect x="20" y="14" width="8" height="6" rx="1" fill="#7f3fff" opacity="0.8"/>
      <!-- Bottom module -->
      <rect x="20" y="28" width="8" height="6" rx="1" fill="#7f3fff" opacity="0.8"/>
    </svg>
  </div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
})

// Trail dot icon for historic positions
function trailIcon(index, total) {
  const opacity = 0.2 + (index / total) * 0.6
  const size = 4 + (index / total) * 4
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:rgba(0,212,255,${opacity});border-radius:50%;box-shadow:0 0 4px rgba(0,212,255,${opacity})"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Component to smoothly fly/pan to new ISS position
function MapController({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lon], map.getZoom(), { animate: true, duration: 1 })
    }
  }, [position, map])
  return null
}

export default function ISSMap() {
  const { issPosition, positions } = useISS()

  const polylinePoints = positions.map(p => [p.lat, p.lon])
  const center = issPosition ? [issPosition.lat, issPosition.lon] : [0, 0]

  return (
    <MapContainer
      center={center}
      zoom={3}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      attributionControl={true}
    >
      {/* Dark space-themed tile layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        opacity={0.6}
      />

      {/* Fly to ISS when position updates */}
      {issPosition && <MapController position={issPosition} />}

      {/* Trajectory polyline */}
      {polylinePoints.length > 1 && (
        <Polyline
          positions={polylinePoints}
          pathOptions={{
            color: '#00d4ff',
            weight: 2.5,
            opacity: 0.6,
            dashArray: '6, 4',
          }}
        />
      )}

      {/* Trail dots for historic positions */}
      {positions.slice(0, -1).map((pos, i) => (
        <Marker
          key={`trail-${i}`}
          position={[pos.lat, pos.lon]}
          icon={trailIcon(i, positions.length)}
        />
      ))}

      {/* Live ISS marker */}
      {issPosition && (
        <Marker position={[issPosition.lat, issPosition.lon]} icon={ISS_ICON} zIndexOffset={1000}>
          <Tooltip permanent={false} direction="top" offset={[0, -20]}
            className="bg-transparent border-0">
            <div style={{
              background: 'rgba(4,8,16,0.95)',
              border: '1px solid rgba(0,212,255,0.4)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              whiteSpace: 'nowrap',
            }}>
              🛸 ISS LIVE<br />
              <span style={{ color: '#00d4ff' }}>
                {parseFloat(issPosition.lat).toFixed(4)}°, {parseFloat(issPosition.lon).toFixed(4)}°
              </span>
            </div>
          </Tooltip>
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '180px' }}>
              <div style={{ fontWeight: 700, color: '#00d4ff', marginBottom: 6, fontSize: 14 }}>
                🛸 International Space Station
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                <div><b>Lat:</b> {parseFloat(issPosition.lat).toFixed(6)}°</div>
                <div><b>Lon:</b> {parseFloat(issPosition.lon).toFixed(6)}°</div>
                <div><b>Updated:</b> {new Date(issPosition.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
