import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { fetchISSPosition, fetchAstronauts } from '../api/issApi'
import { getCache, setCache } from '../utils/cache'
import { haversineDistance } from '../utils/haversine'
import toast from 'react-hot-toast'

const ISSContext = createContext()

const MAX_POSITIONS = 15
const MAX_SPEED_HISTORY = 30
const POLL_INTERVAL_MS = 15000

export function ISSProvider({ children }) {
  const [issPosition, setIssPosition] = useState(null)
  const [positions, setPositions] = useState([]) // last 15 positions
  const [speedHistory, setSpeedHistory] = useState([]) // last 30 speed readings
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [locationName, setLocationName] = useState('Calculating...')
  const [astronauts, setAstronauts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const intervalRef = useRef(null)
  const prevPositionRef = useRef(null)
  const prevTimeRef = useRef(null)

  // Reverse geocode using Nominatim
  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data && data.address) {
        const { city, town, village, county, state, country, ocean, sea, body_of_water } = data.address
        return city || town || village || county || ocean || sea || body_of_water || state || country || 'Open Ocean'
      }
    } catch {
      // Silently fail — ISS is often over ocean
    }
    return 'Open Ocean / Unknown'
  }, [])

  // Fetch ISS position + calculate speed
  const fetchPosition = useCallback(async () => {
    try {
      const data = await fetchISSPosition()
      const lat = parseFloat(data.iss_position.latitude)
      const lon = parseFloat(data.iss_position.longitude)
      const now = Date.now()

      // Calculate speed using Haversine formula
      let speed = currentSpeed
      if (prevPositionRef.current && prevTimeRef.current) {
        const dist = haversineDistance(
          prevPositionRef.current.lat, prevPositionRef.current.lon,
          lat, lon
        ) // km
        const timeHrs = (now - prevTimeRef.current) / 3600000
        if (timeHrs > 0) {
          speed = Math.round(dist / timeHrs)
          // ISS typical speed ~27,600 km/h; clamp for sanity
          if (speed > 100000) speed = currentSpeed
        }
      }

      prevPositionRef.current = { lat, lon }
      prevTimeRef.current = now

      const newPos = { lat, lon, timestamp: now }
      setIssPosition(newPos)
      setCurrentSpeed(speed)
      setLastUpdated(now)
      setError(null)

      // Update position history (keep last MAX_POSITIONS)
      setPositions(prev => {
        const updated = [...prev, newPos]
        return updated.slice(-MAX_POSITIONS)
      })

      // Update speed history (keep last MAX_SPEED_HISTORY)
      if (speed > 0) {
        setSpeedHistory(prev => {
          const updated = [...prev, { time: new Date(now).toLocaleTimeString(), speed, timestamp: now }]
          return updated.slice(-MAX_SPEED_HISTORY)
        })
      }

      // Geocode in background
      reverseGeocode(lat, lon).then(name => setLocationName(name))

      setLoading(false)
    } catch (err) {
      setError('Failed to fetch ISS position. Retrying...')
      setLoading(false)
    }
  }, [currentSpeed, reverseGeocode])

  // Fetch astronauts (cached for 5 minutes)
  const fetchAstronautData = useCallback(async () => {
    const cacheKey = 'iss-astronauts'
    const cached = getCache(cacheKey, 5)
    if (cached) {
      setAstronauts(cached)
      return
    }
    try {
      const data = await fetchAstronauts()
      setAstronauts(data.people || [])
      setCache(cacheKey, data.people || [])
    } catch {
      // Silently fail; non-critical
    }
  }, [])

  // Manual refresh
  const refresh = useCallback(() => {
    toast.success('Refreshing ISS position...', { icon: '🛸' })
    fetchPosition()
  }, [fetchPosition])

  useEffect(() => {
    // Initial fetch
    fetchPosition()
    fetchAstronautData()

    // Poll every 15 seconds
    intervalRef.current = setInterval(fetchPosition, POLL_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, []) // eslint-disable-line

  return (
    <ISSContext.Provider value={{
      issPosition,
      positions,
      speedHistory,
      currentSpeed,
      locationName,
      astronauts,
      loading,
      error,
      lastUpdated,
      refresh,
    }}>
      {children}
    </ISSContext.Provider>
  )
}

export function useISS() {
  return useContext(ISSContext)
}
