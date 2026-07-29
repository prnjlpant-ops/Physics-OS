import { useMemo, useState } from 'react'
import { AlertTriangle, Download, X } from 'lucide-react'
import { useTopicIndex } from '../../hooks/useTopicIndex'
import TopicSearchBar from '../../components/topics/TopicSearchBar'
import TopicGrid from '../../components/topics/TopicGrid'
import TopicNavigator from '../../components/topics/TopicNavigator'
import { TOPIC_SORT_OPTIONS } from '../../constants/topicConstants'
import exampleTopicIndex from '../../data/pyq/pyq_index.example.json'

function downloadJson(filename, jsonString) {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/**
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * The Topic Index — browse Subject -> Chapter -> Topic, or search across
 * all three, sourced entirely from `pyq_index.json`'s `topics` array
 * through `TopicIndexService`/`TopicNavigationService`. Works correctly
 * (with a clear empty state) even when no topics have been indexed yet —
 * this sprint introduces the architecture, not a populated dataset.
 */
export default function TopicIndexPage() {
  const {
    subjects,
    results,
    stats,
    search,
    setSearch,
    sortKey,
    setSortKey,
    warnings,
    selectedSubjectId,
    selectedChapterSlug,
    selectedChapters,
    selectedChapterTopics,
    selectSubject,
    selectChapter,
    resetSelection,
  } = useTopicIndex()
  const [warningsDismissed, setWarningsDismissed] = useState(false)

  const isSearching = search.trim().length > 0
  const sortedResults = useMemo(() => results, [results])

  const handleDownloadTemplate = () => {
    downloadJson('pyq_index.example.json', JSON.stringify(exampleTopicIndex, null, 2))
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#e8e8e8]">Topic Index</h2>
          <p className="mt-0.5 text-xs text-[#858585]">
            Subject → Chapter → Topic → Resources → PYQs, sourced from pyq_index.json.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadTemplate}
          title="Download an example pyq_index.json with sample topics"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
        >
          <Download size={13} strokeWidth={1.75} />
          Download Template
        </button>
      </div>

      {warnings.length > 0 && !warningsDismissed && (
        <div className="flex items-start gap-2.5 rounded-md border border-[#5a4a3c] bg-[#2b2419] p-3 text-[11px] leading-relaxed text-[#d2b48c]">
          <AlertTriangle size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-[#e2c08d]">
              {warnings.length} issue{warnings.length === 1 ? '' : 's'} found while loading pyq_index.json
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
          { label: 'Chapters Indexed', value: stats.chapterCount },
          { label: 'Topics', value: stats.topicCount },
          { label: 'With Resources', value: stats.withResources },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5">
            <p className="text-xs text-[#858585]">{stat.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-[#e8e8e8]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <TopicSearchBar value={search} onChange={setSearch} />
        {isSearching && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-[#858585]">{sortedResults.length} results</span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
              aria-label="Sort by"
              className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] focus:border-[#0e639c] focus:outline-none"
            >
              {TOPIC_SORT_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {stats.topicCount === 0 ? (
        <div className="rounded-lg border border-dashed border-[#3c3c3c] px-4 py-12 text-center">
          <p className="text-sm text-[#9d9d9d]">No topics indexed yet.</p>
          <p className="mx-auto mt-1.5 max-w-md text-[11px] leading-relaxed text-[#6e6e6e]">
            Add entries to the <span className="font-mono text-[#858585]">topics</span> array in{' '}
            <span className="font-mono text-[#858585]">pyq_index.json</span> to begin topic-wise studying — every
            subject, chapter, and topic is read from that file, nothing is hardcoded.
          </p>
        </div>
      ) : isSearching ? (
        <TopicGrid topics={sortedResults} emptyLabel="No topics match your search" />
      ) : (
        <TopicNavigator
          subjects={subjects}
          selectedSubjectId={selectedSubjectId}
          selectedChapterSlug={selectedChapterSlug}
          selectedChapters={selectedChapters}
          selectedChapterTopics={selectedChapterTopics}
          selectSubject={selectSubject}
          selectChapter={selectChapter}
          resetSelection={resetSelection}
        />
      )}
    </div>
  )
}
