const NOTES_STORAGE_KEY = 'physicsOS.notes'
const NOTES_EVENT = 'physicsOS.notesChanged'

function generateId() {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function readAll() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(notes) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
    window.dispatchEvent(new Event(NOTES_EVENT))
    return true
  } catch {
    // Local storage unavailable or full; notes won't persist, fail silently.
    return false
  }
}

/**
 * Notes are stored completely separately from Memory Sheets and Formula
 * Sheets so future AI features can read this store without touching the
 * editor. Every note is linked to a syllabus Subject + Chapter, never to a
 * Book.
 *
 * Note shape:
 * {
 *   id, subjectId, chapterSlug, title, content,
 *   createdAt, modifiedAt, pinned, bookmarked
 * }
 */
export function getAllNotes() {
  return readAll()
}

export function getNoteById(noteId) {
  return readAll().find((note) => note.id === noteId) ?? null
}

export function getChapterNotes(subjectId, chapterSlug) {
  return readAll().filter(
    (note) => note.subjectId === subjectId && note.chapterSlug === chapterSlug,
  )
}

export function getSubjectNotes(subjectId) {
  return readAll().filter((note) => note.subjectId === subjectId)
}

export function createNote({ subjectId, chapterSlug, title = 'Untitled Note', content = '' }) {
  const notes = readAll()
  const now = new Date().toISOString()
  const note = {
    id: generateId(),
    subjectId,
    chapterSlug,
    title,
    content,
    createdAt: now,
    modifiedAt: now,
    pinned: false,
    bookmarked: false,
  }
  writeAll([...notes, note])
  return note
}

export function updateNote(noteId, changes) {
  const notes = readAll()
  let updated = null
  const next = notes.map((note) => {
    if (note.id !== noteId) return note
    updated = {
      ...note,
      ...changes,
      modifiedAt: new Date().toISOString(),
    }
    return updated
  })
  if (updated) writeAll(next)
  return updated
}

export function deleteNote(noteId) {
  const notes = readAll()
  const next = notes.filter((note) => note.id !== noteId)
  writeAll(next)
}

export function toggleNotePin(noteId) {
  const note = getNoteById(noteId)
  if (!note) return null
  return updateNote(noteId, { pinned: !note.pinned })
}

export function toggleNoteBookmark(noteId) {
  const note = getNoteById(noteId)
  if (!note) return null
  return updateNote(noteId, { bookmarked: !note.bookmarked })
}

export const NOTES_STORAGE_EVENT = NOTES_EVENT
