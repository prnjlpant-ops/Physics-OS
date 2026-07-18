import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NotebookPen, Pin, Clock } from 'lucide-react'
import { subjects } from '../constants/subjects'
import { useNotes } from '../hooks/useNotes'
import { getAllChapterNoteStats, searchNotes } from '../data/notesData'
import { REVISION_STATUS } from '../constants/notesConstants'
import SearchBar from '../components/resources/SearchBar'
import NotesFilterBar from '../components/notes/NotesFilterBar'
import NoteListItem from '../components/notes/NoteListItem'
import ChapterNotesCard from '../components/notes/ChapterNotesCard'
import EmptyState from './subject/EmptyState'

const STATUS_STYLES = {
  [REVISION_STATUS.NONE]: 'border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]',
  [REVISION_STATUS.FRESH]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  [REVISION_STATUS.DUE]: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

function formatDate(iso) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NotesPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [chapterSlug, setChapterSlug] = useState('all')
  const [recentlyEditedOnly, setRecentlyEditedOnly] = useState(false)
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const { notes, togglePin, toggleBookmark } = useNotes()

  const chapters = useMemo(() => {
    if (subjectId === 'all') return []
    return subjects.find((subject) => subject.id === subjectId)?.chapters ?? []
  }, [subjectId])

  const isSearching = search.trim().length > 0

  const searchResults = useMemo(() => {
    if (!isSearching) return []
    return searchNotes(notes, subjects, search).filter(({ note }) => {
      if (subjectId !== 'all' && note.subjectId !== subjectId) return false
      if (chapterSlug !== 'all' && note.chapterSlug !== chapterSlug) return false
      if (bookmarkedOnly && !note.bookmarked) return false
      return true
    })
  }, [isSearching, notes, search, subjectId, chapterSlug, bookmarkedOnly])

  const pinnedNotes = useMemo(() => notes.filter((note) => note.pinned), [notes])

  const recentNotes = useMemo(
    () =>
      [...notes]
        .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))
        .slice(0, 5),
    [notes],
  )

  const bookmarkedNotes = useMemo(() => notes.filter((note) => note.bookmarked), [notes])

  const dashboardRows = useMemo(() => {
    let rows = getAllChapterNoteStats(notes, subjects)
    if (subjectId !== 'all') rows = rows.filter((row) => row.subject.id === subjectId)
    if (chapterSlug !== 'all') rows = rows.filter((row) => row.chapter.slug === chapterSlug)
    if (recentlyEditedOnly) {
      rows = [...rows]
        .filter((row) => row.lastEdited)
        .sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited))
    }
    if (bookmarkedOnly) {
      const bookmarkedKeys = new Set(
        bookmarkedNotes.map((note) => `${note.subjectId}::${note.chapterSlug}`),
      )
      rows = rows.filter((row) => bookmarkedKeys.has(`${row.subject.id}::${row.chapter.slug}`))
    }
    return rows.filter((row) => row.totalNotes > 0 || (!recentlyEditedOnly && !bookmarkedOnly))
  }, [notes, subjectId, chapterSlug, recentlyEditedOnly, bookmarkedOnly, bookmarkedNotes])

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Notes</h2>
        <p className="mt-0.5 text-xs text-[#858585]">
          Your permanent knowledge base, organized by Subject and Chapter.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search notes by title or keyword..." />
        <NotesFilterBar
          subjects={subjects}
          subjectId={subjectId}
          onSubjectChange={(value) => {
            setSubjectId(value)
            setChapterSlug('all')
          }}
          chapters={chapters}
          chapterSlug={chapterSlug}
          onChapterChange={setChapterSlug}
          hideChapter={subjectId === 'all'}
          recentlyEditedOnly={recentlyEditedOnly}
          onRecentlyEditedToggle={setRecentlyEditedOnly}
          bookmarkedOnly={bookmarkedOnly}
          onBookmarkedToggle={setBookmarkedOnly}
        />
      </div>

      {isSearching ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Matching Notes</h3>
            <span className="text-xs text-[#858585]">{searchResults.length} results</span>
          </div>
          {searchResults.length === 0 ? (
            <EmptyState icon={NotebookPen} title="No notes match your search" />
          ) : (
            <div className="flex flex-col gap-2.5">
              {searchResults.map(({ note, subject, chapter }) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  subjectName={subject.name}
                  chapterName={chapter.name}
                  showBreadcrumb
                  onTogglePin={togglePin}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {pinnedNotes.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
                <Pin size={14} strokeWidth={1.75} className="text-[#4fc1ff]" />
                Pinned Notes
              </h3>
              <div className="flex flex-col gap-2.5">
                {pinnedNotes.map((note) => {
                  const subject = subjects.find((item) => item.id === note.subjectId)
                  const chapter = subject?.chapters.find((item) => item.slug === note.chapterSlug)
                  return (
                    <NoteListItem
                      key={note.id}
                      note={note}
                      subjectName={subject?.name}
                      chapterName={chapter?.name}
                      showBreadcrumb
                      onTogglePin={togglePin}
                      onToggleBookmark={toggleBookmark}
                    />
                  )
                })}
              </div>
            </section>
          )}

          {recentNotes.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
                <Clock size={14} strokeWidth={1.75} className="text-[#858585]" />
                Recent Notes
              </h3>
              <div className="flex flex-col gap-2.5">
                {recentNotes.map((note) => {
                  const subject = subjects.find((item) => item.id === note.subjectId)
                  const chapter = subject?.chapters.find((item) => item.slug === note.chapterSlug)
                  return (
                    <NoteListItem
                      key={note.id}
                      note={note}
                      subjectName={subject?.name}
                      chapterName={chapter?.name}
                      showBreadcrumb
                      onTogglePin={togglePin}
                      onToggleBookmark={toggleBookmark}
                    />
                  )
                })}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Notes Dashboard</h3>

            <div className="hidden overflow-hidden rounded-lg border border-[#3c3c3c] sm:block">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#252526] text-[10px] uppercase tracking-wide text-[#6e6e6e]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Subject</th>
                    <th className="px-4 py-2.5 font-medium">Chapter</th>
                    <th className="px-4 py-2.5 font-medium">Total Notes</th>
                    <th className="px-4 py-2.5 font-medium">Last Edited</th>
                    <th className="px-4 py-2.5 font-medium">Revision Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardRows.map((row) => (
                    <tr key={`${row.subject.id}-${row.chapter.slug}`} className="border-t border-[#3c3c3c]">
                      <td className="px-4 py-2.5 text-[#cccccc]">
                        <Link
                          to={`/subjects/${row.subject.id}/chapters/${row.chapter.slug}/notes`}
                          className="hover:text-[#4fc1ff]"
                        >
                          {row.subject.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-[#cccccc]">{row.chapter.name}</td>
                      <td className="px-4 py-2.5 text-[#858585]">{row.totalNotes}</td>
                      <td className="px-4 py-2.5 text-[#858585]">{formatDate(row.lastEdited)}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[row.revisionStatus]}`}
                        >
                          {row.revisionStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dashboardRows.length === 0 && (
                <div className="px-4 py-8">
                  <EmptyState icon={NotebookPen} title="No chapters match your filters" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:hidden">
              {dashboardRows.map((row) => (
                <ChapterNotesCard
                  key={`${row.subject.id}-${row.chapter.slug}`}
                  subjectId={row.subject.id}
                  subjectName={row.subject.name}
                  chapter={row.chapter}
                  totalNotes={row.totalNotes}
                  lastEdited={row.lastEdited}
                  revisionStatus={row.revisionStatus}
                />
              ))}
              {dashboardRows.length === 0 && (
                <EmptyState icon={NotebookPen} title="No chapters match your filters" />
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
