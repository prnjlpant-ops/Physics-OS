import { useCallback, useEffect, useState } from 'react'

const FAVORITES_STORAGE_KEY = 'physicsOS.resourceFavorites'
const FAVORITES_EVENT = 'physicsOS.resourceFavoritesChanged'

function readFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeFavorites(ids) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
    window.dispatchEvent(new Event(FAVORITES_EVENT))
  } catch {
    // Local storage unavailable or full; favorites won't persist, fail silently.
  }
}

/**
 * Local-first, UI-only favorites store for the Resources module.
 * No backend, no database — persisted to localStorage only.
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(readFavorites)

  useEffect(() => {
    const sync = () => setFavoriteIds(readFavorites())
    window.addEventListener(FAVORITES_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggleFavorite = useCallback((resourceId) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
      writeFavorites(next)
      return next
    })
  }, [])

  return { favoriteIds, toggleFavorite }
}
