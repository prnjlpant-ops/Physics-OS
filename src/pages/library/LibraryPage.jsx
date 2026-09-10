import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Settings2, X } from 'lucide-react'
import { useLibrary } from '../../hooks/useLibrary'
import { useLibraryBookmarks } from '../../hooks/useLibraryBookmarks'
import LibrarySearchBar from '../../components/library/LibrarySearchBar'
import LibraryFilterBar from '../../components/library/LibraryFilterBar'
import BookGrid from '../../components/library/BookGrid'
import { LIBRARY_SORT_OPTIONS } from '../../constants/libraryConstants'

function groupResourcesBySubjectAndChapter(resources) {
  const groups = new Map()

  resources.forEach((resource) => {
    const subjectName = resource.subjectName || resource.subject || 'Unassigned'
    const chapterName = resource.chapterName || 'General'
    const key = `${subjectName}::${chapterName}`

    if (!groups.has(key)) {
      groups.set(key, { subjectName, chapterName, items: [] })
    }

    groups.get(key).items.push(resource)
  })

  return [...groups.values()].sort((left, right) => {
    if (left.subjectName === right.subjectName) return left.chapterName.localeCompare(right.chapterName)
    return left.subjectName.localeCompare(right.subjectName)
  })
}

export default function LibraryPage() {
  const {
    subjects,
    authors,
    results,
    stats,
    search,
    setSearch,
    filters,
    setFilter,
    sortKey,
    setSortKey,
    warnings,
  } = useLibrary()
  const { bookmarkIds, toggleBookmark } = useLibraryBookmarks()
  const [warningsDismissed, setWarningsDismissed] = useState(false)

  const bookmarkedResources = useMemo(
    () => results.filter((resource) => bookmarkIds.includes(resource.id)),
    [results, bookmarkIds],
  )

  const groupedResults = useMemo(() => groupResourcesBySubjectAndChapter(results), [results])
  const groupedBookmarks = useMemo(() => groupResourcesBySubjectAndChapter(bookmarkedResources), [bookmarkedResources])

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#e8e8e8]">Library</h2>
          <p className="mt-0.5 text-xs text-[#858585]">
            The Knowledge Base &amp; Resource Engine — every book, grouped by subject and chapter for faster chapter-wise study.
          </p>
        </div>
        <Link
          to="/library/settings"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
        >
          <Settings2 size={13} strokeWidth={1.75} />
          Settings
        </Link>
      </div>

      {warnings.length > 0 && !warningsDismissed && (
        <div className="flex items-start gap-2.5 rounded-md border border-[#5a4a3c] bg-[#2b2419] p-3 text-[11px] leading-relaxed text-[#d2b48c]">
          <AlertTriangle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-[#e2c08d]">
              {warnings.length} issue{warnings.length === 1 ? '' : 's'} found while loading the Master Index
            </p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => setWarningsDismissed(true)}
            aria-label="Dismiss warnings"
            className="shrink-0 text-[#d2b48c] hover:text-[#e2c08d]"
          >
            <X size={14} strokeWidth={1.75} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Subjects', value: stats.subjectCount },
          { label: 'Total Resources', value: stats.totalResources },
          { label: 'Available', value: stats.available },
          { label: 'Not Added', value: stats.notAdded },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5">
            <p className="text-xs text-[#858585]">{stat.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-[#e8e8e8]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <LibrarySearchBar value={search} onChange={setSearch} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <LibraryFilterBar subjects={subjects} authors={authors} filters={filters} onFilterChange={setFilter} />
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
            aria-label="Sort by"
            className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] focus:border-[#0e639c] focus:outline-none"
          >
            {LIBRARY_SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {bookmarkedResources.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Bookmarked</h3>
          <div className="flex flex-col gap-4">
            {groupedBookmarks.map((group) => (
              <div key={`bookmark-${group.subjectName}-${group.chapterName}`} className="rounded-lg border border-[#3c3c3c] bg-[#1f1f1f] p-3">
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#3c3c3c] pb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#858585]">{group.subjectName}</p>
                    <h4 className="mt-1 text-sm font-semibold text-[#e8e8e8]">{group.chapterName}</h4>
                  </div>
                  <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-1 text-[10px] text-[#9d9d9d]">{group.items.length}</span>
                </div>
                <BookGrid resources={group.items} bookmarkIds={bookmarkIds} onToggleBookmark={toggleBookmark} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">All Resources</h3>
          <span className="text-xs text-[#858585]">{results.length} results</span>
        </div>
        {groupedResults.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#3c3c3c] px-4 py-10 text-center text-xs text-[#6e6e6e]">No resources match your search or filters</div>
        ) : (
          <div className="flex flex-col gap-4">
            {groupedResults.map((group) => (
              <div key={`${group.subjectName}-${group.chapterName}`} className="rounded-lg border border-[#3c3c3c] bg-[#1f1f1f] p-3">
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#3c3c3c] pb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#858585]">{group.subjectName}</p>
                    <h4 className="mt-1 text-sm font-semibold text-[#e8e8e8]">{group.chapterName}</h4>
                  </div>
                  <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-1 text-[10px] text-[#9d9d9d]">{group.items.length}</span>
                </div>
                <BookGrid resources={group.items} bookmarkIds={bookmarkIds} onToggleBookmark={toggleBookmark} emptyLabel="No resources in this chapter" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
