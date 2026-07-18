import { getRevisionStatus } from '../constants/notesConstants'

/**
 * Builds the Notes Dashboard summary row for a single chapter: total notes,
 * last edited timestamp, and revision status. Notes belong to Chapters, not
 * Books, so this never touches book/resource data.
 */
export function getChapterNoteStats(notes, subjectId, chapterSlug) {
  const chapterNotes = notes.filter(
    (note) => note.subjectId === subjectId && note.chapterSlug === chapterSlug,
  )

  const lastEdited = chapterNotes.reduce((latest, note) => {
    if (!latest) return note.modifiedAt
    return new Date(note.modifiedAt) > new Date(latest) ? note.modifiedAt : latest
  }, null)

  return {
    totalNotes: chapterNotes.length,
    lastEdited,
    revisionStatus: getRevisionStatus(lastEdited),
  }
}

export function getSubjectNoteStats(notes, subject) {
  return subject.chapters.map((chapter) => ({
    chapter,
    ...getChapterNoteStats(notes, subject.id, chapter.slug),
  }))
}

export function getAllChapterNoteStats(notes, subjects) {
  return subjects.flatMap((subject) =>
    subject.chapters.map((chapter) => ({
      subject,
      chapter,
      ...getChapterNoteStats(notes, subject.id, chapter.slug),
    })),
  )
}

export function searchNotes(notes, subjects, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return notes
    .filter((note) => {
      const haystack = `${note.title} ${note.content}`.toLowerCase()
      return haystack.includes(q)
    })
    .map((note) => {
      const subject = subjects.find((item) => item.id === note.subjectId)
      const chapter = subject?.chapters.find((item) => item.slug === note.chapterSlug)
      return { note, subject, chapter }
    })
    .filter((entry) => entry.subject && entry.chapter)
}
