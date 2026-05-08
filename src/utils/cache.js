/**
 * localStorage cache manager with TTL (time-to-live) support.
 * TTL is specified in minutes.
 */

const PREFIX = 'iss-dashboard-cache-'

/**
 * Store data with a timestamp.
 */
export function setCache(key, data) {
  try {
    const record = { data, timestamp: Date.now() }
    localStorage.setItem(PREFIX + key, JSON.stringify(record))
  } catch (e) {
    // Storage quota exceeded — ignore
    console.warn('Cache write failed:', e)
  }
}

/**
 * Retrieve data if it's still within TTL minutes.
 * Returns null if expired or missing.
 */
export function getCache(key, ttlMinutes = 15) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    const ageMs = Date.now() - timestamp
    const ttlMs = ttlMinutes * 60 * 1000
    if (ageMs > ttlMs) {
      localStorage.removeItem(PREFIX + key)
      return null
    }
    return data
  } catch {
    return null
  }
}

/**
 * Remove a specific cache entry.
 */
export function clearCache(key) {
  localStorage.removeItem(PREFIX + key)
}

/**
 * Clear all dashboard cache entries.
 */
export function clearAllCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .forEach(k => localStorage.removeItem(k))
}
