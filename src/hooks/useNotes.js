import { useCallback, useEffect, useState } from 'react'
import {
  NOTES_STORAGE_EVENT,
  createNote,
  deleteNote,
  getAllNotes,
  toggleNoteBookmark,
  toggleNotePin,
  updateNote,
} from '../utils/notesStorage'

/**
 * Local-first store hook for the Notes module. Notes persist to
 * localStorage only (no cloud sync, no database) and stay isolated from
 * Memory Sheets and Formula Sheets storage.
 */
export function useNotes() {
  const [notes, setNotes] = useState(getAllNotes)

  useEffect(() => {
    const sync = () => setNotes(getAllNotes())
    window.addEventListener(NOTES_STORAGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(NOTES_STORAGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const addNote = useCallback((payload) => createNote(payload), [])
  const saveNote = useCallback((noteId, changes) => updateNote(noteId, changes), [])
  const removeNote = useCallback((noteId) => deleteNote(noteId), [])
  const togglePin = useCallback((noteId) => toggleNotePin(noteId), [])
  const toggleBookmark = useCallback((noteId) => toggleNoteBookmark(noteId), [])

  return { notes, addNote, saveNote, removeNote, togglePin, toggleBookmark }
}
