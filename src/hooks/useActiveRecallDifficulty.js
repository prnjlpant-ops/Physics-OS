import { useCallback, useEffect, useState } from 'react'

const DIFFICULTY_STORAGE_KEY = 'physicsOS.activeRecallDifficultyOverrides'
const DIFFICULTY_EVENT = 'physicsOS.activeRecallDifficultyChanged'

function readOverrides() {
  try {
    const raw = localStorage.getItem(DIFFICULTY_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeOverrides(map) {
  try {
    localStorage.setItem(DIFFICULTY_STORAGE_KEY, JSON.stringify(map))
    window.dispatchEvent(new Event(DIFFICULTY_EVENT))
  } catch {
    // Local storage unavailable or full; rating won't persist, fail silently.
  }
}

/**
 * Local-first "Mark Easy / Medium / Hard" self-rating for Study Mode.
 * A user rating overrides the card's placeholder difficulty everywhere
 * (filters, badges) until changed again. No automatic evaluation.
 */
export function useActiveRecallDifficulty() {
  const [overrides, setOverrides] = useState(readOverrides)

  useEffect(() => {
    const sync = () => setOverrides(readOverrides())
    window.addEventListener(DIFFICULTY_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(DIFFICULTY_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const getDifficulty = useCallback(
    (card) => overrides[card.id] ?? card.difficulty,
    [overrides],
  )

  const setDifficulty = useCallback((cardId, level) => {
    setOverrides((prev) => {
      const next = { ...prev, [cardId]: level }
      writeOverrides(next)
      return next
    })
  }, [])

  return { getDifficulty, setDifficulty }
}
