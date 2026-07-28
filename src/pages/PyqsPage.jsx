import { useMemo, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { usePyqLibrary } from '../hooks/usePyqLibrary'
import PaperSearchBar from '../components/paperLibrary/PaperSearchBar'
import PaperFilterBar from '../components/paperLibrary/PaperFilterBar'
import PaperGrid from '../components/paperLibrary/PaperGrid'
import { PAPER_SORT_OPTIONS } from '../constants/pyqLibraryConstants'

/**
 * Sprint 25 — PYQ Engine.
 *
 * The Paper Library — now the primary way of browsing and managing
 * previous year question papers, sourced entirely from `pyqs.json` through
 * `PYQService`/`PaperService`. This replaces what was previously just a
 * placeholder title at `/pyqs`; the existing per-chapter PYQ practice
 * feature (individual questions, at `/subjects/:subjectId/pyqs`) is a
 * separate, untouched feature — this page is about whole exam papers.
 */
export default function PyqsPage() {
  const {
    years,
    subjects,
    results,
    stats,
    search,
    setSearch,
    filters,
    setFilter,
    sortKey,
    setSortKey,
    warnings,
    bookmarkIds,
    toggleBookmark,
  } = usePyqLibrary()
  const [warningsDismissed, setWarningsDismissed] = useState(false)

  const bookmarkedPapers = useMemo(
    () => results.filter((paper) => bookmarkIds.includes(paper.id)),
    [results, bookmarkIds],
  )

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">PYQs</h2>
        <p className="mt-0.5 text-xs text-[#858585]">
          The Paper Library — every previous year paper, sourced from pyqs.json.
        </p>
      </div>

      {warnings.length > 0 && !warningsDismissed && (
        <div className="flex items-start gap-2.5 rounded-md border border-[#5a4a3c] bg-[#2b2419] p-3 text-[11px] leading-relaxed text-[#d2b48c]">
          <AlertTriangle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-[#e2c08d]">
              {warnings.length} issue{warnings.length === 1 ? '' : 's'} found while loading pyqs.json
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
          { label: 'Total Papers', value: stats.totalPapers },
          { label: 'Path Added', value: stats.withPath },
          { label: 'Not Added', value: stats.notAdded },
          { label: 'Completed', value: stats.completed },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5">
            <p className="text-xs text-[#858585]">{stat.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-[#e8e8e8]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <PaperSearchBar value={search} onChange={setSearch} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PaperFilterBar years={years} subjects={subjects} filters={filters} onFilterChange={setFilter} />
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
            aria-label="Sort by"
            className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] focus:border-[#0e639c] focus:outline-none"
          >
            {PAPER_SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {bookmarkedPapers.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Bookmarked</h3>
          <PaperGrid papers={bookmarkedPapers} bookmarkIds={bookmarkIds} onToggleBookmark={toggleBookmark} />
        </section>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">All Papers</h3>
          <span className="text-xs text-[#858585]">{results.length} results</span>
        </div>
        <PaperGrid
          papers={results}
          bookmarkIds={bookmarkIds}
          onToggleBookmark={toggleBookmark}
          emptyLabel="No papers match your search or filters"
        />
      </section>
    </div>
  )
}
