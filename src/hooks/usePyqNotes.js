import { useCallback, useEffect, useState } from 'react'

const NOTES_STORAGE_KEY = 'physicsOS.pyqNotes'
const NOTES_EVENT = 'physicsOS.pyqNotesChanged'

function readNotes() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeNotes(map) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(map))
    window.dispatchEvent(new Event(NOTES_EVENT))
  } catch {
    // Local storage unavailable or full; note text won't persist, fail silently.
  }
}

/**
 * Local-first per-question note (separate from the main Notes module store)
 * used by the PYQ detail page's "Notes" tab.
 */
export function usePyqNotes() {
  const [notes, setNotes] = useState(readNotes)

  useEffect(() => {
    const sync = () => setNotes(readNotes())
    window.addEventListener(NOTES_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(NOTES_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const getNote = useCallback((pyq) => notes[pyq.id] ?? pyq.notes ?? '', [notes])

  const setNote = useCallback((pyqId, text) => {
    setNotes((prev) => {
      const next = { ...prev, [pyqId]: text }
      writeNotes(next)
      return next
    })
  }, [])

  return { getNote, setNote }
}
