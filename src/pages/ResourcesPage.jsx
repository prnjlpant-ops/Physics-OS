import { useMemo, useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { getAllResources, getChapterResources } from '../data/resourcesData'
import { getSubjects } from '../engine/blueprintService'
import { RESOURCE_TYPE_ORDER, RESOURCE_TYPE_META } from '../constants/resourceTypes'
import { useFavorites } from '../hooks/useFavorites'
import SearchBar from '../components/resources/SearchBar'
import ResourceGrid from '../components/resources/ResourceGrid'

const ALL_RESOURCES = getAllResources()

/**
 * Resources tab — chapter-first browse.
 * ======================================
 * Previously a single flat page: every resource across every subject and
 * chapter in one filtered grid. Reworked so the default path is
 * Subjects -> Chapters -> that chapter's resources (grouped by type),
 * matching how the rest of the app (Formula Sheets, Memory Sheets, PYQs)
 * is already organized. Search still works globally — typing a query
 * switches to a flat filtered view across everything, same as before,
 * so nothing that worked previously is lost.
 */
export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState(null)
  const [chapterSlug, setChapterSlug] = useState(null)
  const { favoriteIds, toggleFavorite } = useFavorites()

  const subjects = useMemo(() => getSubjects(), [])
  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === subjectId) ?? null,
    [subjects, subjectId],
  )
  const selectedChapter = useMemo(
    () => selectedSubject?.chapters.find((chapter) => chapter.slug === chapterSlug) ?? null,
    [selectedSubject, chapterSlug],
  )

  const query = search.trim().toLowerCase()
  const isSearching = query.length > 0

  const searchResults = useMemo(() => {
    if (!isSearching) return []
    return ALL_RESOURCES.filter((resource) => {
      const haystack = `${resource.title} ${resource.subjectName} ${resource.chapterName}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [isSearching, query])

  const chapterResources = useMemo(() => {
    if (!selectedSubject || !selectedChapter) return null
    return getChapterResources(selectedSubject, selectedChapter)
  }, [selectedSubject, selectedChapter])

  function goToSubjects() {
    setSubjectId(null)
    setChapterSlug(null)
  }

  function goToChapters(id) {
    setSubjectId(id)
    setChapterSlug(null)
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Resources</h2>
        <p className="mt-0.5 text-xs text-[#858585]">
          The central library for every subject and chapter.
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {isSearching ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Search Results</h3>
            <span className="text-xs text-[#858585]">{searchResults.length} results</span>
          </div>
          <ResourceGrid
            resources={searchResults}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            showChapter
            emptyLabel="No resources match your search"
          />
        </section>
      ) : selectedSubject && selectedChapter ? (
        <ChapterResourcesView
          subject={selectedSubject}
          chapter={selectedChapter}
          resources={chapterResources}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onBack={() => setChapterSlug(null)}
          onBackToSubjects={goToSubjects}
        />
      ) : selectedSubject ? (
        <ChapterListView
          subject={selectedSubject}
          onSelectChapter={setChapterSlug}
          onBack={goToSubjects}
        />
      ) : (
        <SubjectListView subjects={subjects} onSelectSubject={goToChapters} />
      )}
    </div>
  )
}

function Breadcrumb({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#858585]">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight size={12} strokeWidth={1.75} />}
          {item.onClick ? (
            <button
              type="button"
              onClick={item.onClick}
              className="text-[#9d9d9d] transition-colors duration-150 hover:text-[#e8e8e8]"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[#e8e8e8]">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}

function SubjectListView({ subjects, onSelectSubject }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-[#e8e8e8]">Pick a subject to see its chapters</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => {
          const Icon = subject.icon
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelectSubject(subject.id)}
              className="group flex flex-col gap-4 rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 text-left transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#2d2d2d]"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] transition-colors duration-150 group-hover:border-[#4a4a4a]">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <ChevronRight
                  size={18}
                  strokeWidth={1.75}
                  className="mt-1 shrink-0 text-[#858585] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#cccccc]"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#e8e8e8]">{subject.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#858585]">{subject.description}</p>
              </div>
              <p className="mt-auto text-[11px] text-[#6e6e6e]">{subject.chapters.length} chapters</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ChapterListView({ subject, onSelectChapter, onBack }) {
  return (
    <section className="flex flex-col gap-3">
      <Breadcrumb
        items={[
          { label: 'Resources', onClick: onBack },
          { label: subject.name },
        ]}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:text-[#e8e8e8]"
        >
          <ChevronLeft size={14} strokeWidth={1.75} />
          All Subjects
        </button>
      </div>
      <h3 className="text-sm font-semibold text-[#e8e8e8]">{subject.name} — Chapters</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {subject.chapters.map((chapter) => (
          <button
            key={chapter.slug}
            type="button"
            onClick={() => onSelectChapter(chapter.slug)}
            className="group flex items-center justify-between gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 text-left transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#2d2d2d]"
          >
            <span className="text-sm font-medium text-[#e8e8e8]">{chapter.name}</span>
            <ChevronRight
              size={16}
              strokeWidth={1.75}
              className="shrink-0 text-[#858585] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#cccccc]"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

function ChapterResourcesView({ subject, chapter, resources, favoriteIds, onToggleFavorite, onBack, onBackToSubjects }) {
  if (!resources) return null

  return (
    <section className="flex flex-col gap-5">
      <Breadcrumb
        items={[
          { label: 'Resources', onClick: onBackToSubjects },
          { label: subject.name, onClick: onBack },
          { label: chapter.name },
        ]}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:text-[#e8e8e8]"
        >
          <ChevronLeft size={14} strokeWidth={1.75} />
          {subject.name} Chapters
        </button>
      </div>
      <h3 className="text-sm font-semibold text-[#e8e8e8]">{chapter.name}</h3>

      {RESOURCE_TYPE_ORDER.map((typeKey) => {
        const items = resources[typeKey] ?? []
        if (items.length === 0) return null
        const meta = RESOURCE_TYPE_META[typeKey]
        return (
          <div key={typeKey} className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[#858585]">{meta.label}</h4>
            <ResourceGrid
              resources={items}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
              emptyLabel="Nothing here yet"
            />
          </div>
        )
      })}
    </section>
  )
}
