import { useMemo, useState } from 'react'
import { topicRecords, topicTree, topicLoadWarnings, topicIndexMeta } from '../engine/topics'
import { getTopicById, getIndexStats } from '../engine/topics/topicIndexService'
import {
  getSubjectsFromTree,
  getChaptersForSubject,
  getTopicsForChapter,
  getBreadcrumbForTopic,
} from '../engine/topics/topicNavigationService'
import { buildStudyMap } from '../engine/topics/studyMappingService'
import { queryTopics, getDistinctChapters } from '../engine/topics/searchService'
import { libraryConfig, libraryMasterIndex } from '../engine/library'
import { pyqLibraryIndex } from '../engine/pyq'
import { DEFAULT_TOPIC_SORT } from '../constants/topicConstants'
import { useTopicProgress } from './useTopicProgress'

/**
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * The main hook every Topic Index page/component uses. Wraps the (static,
 * built-once) Topic Index + navigation tree with the bits of state a
 * browsing UI needs — search text, active filters, sort order, drill-down
 * selection — and decorates each topic with its *live* status from
 * `TopicProgressService`, the same "static index + live progress" split
 * `hooks/usePyqLibrary.js` already uses for papers.
 */
export function useTopicIndex() {
  const { getStatus, setStatus } = useTopicProgress()

  const allTopics = useMemo(
    () => topicRecords.map((topic) => ({ ...topic, status: getStatus(topic.id) })),
    [getStatus],
  )

  const subjects = useMemo(() => getSubjectsFromTree(topicTree), [])

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ subjectId: 'all', chapterSlug: 'all', status: 'all' })
  const [sortKey, setSortKey] = useState(DEFAULT_TOPIC_SORT)

  // Drill-down selection for the Subject -> Chapter -> Topic navigator.
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [selectedChapterSlug, setSelectedChapterSlug] = useState(null)

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const chapters = useMemo(() => getDistinctChapters(topicRecords, filters.subjectId), [filters.subjectId])

  const results = useMemo(
    () => queryTopics(allTopics, { query: search, filters, sortKey, getStatus }),
    [allTopics, search, filters, sortKey, getStatus],
  )

  const stats = useMemo(() => getIndexStats({ topics: topicRecords }, libraryConfig), [])

  const selectedChapters = useMemo(
    () => (selectedSubjectId ? getChaptersForSubject(topicTree, selectedSubjectId) : []),
    [selectedSubjectId],
  )
  const selectedChapterTopics = useMemo(
    () =>
      selectedSubjectId && selectedChapterSlug
        ? getTopicsForChapter(topicTree, selectedSubjectId, selectedChapterSlug).map((topic) => ({
            ...topic,
            status: getStatus(topic.id),
          }))
        : [],
    [selectedSubjectId, selectedChapterSlug, getStatus],
  )

  const selectSubject = (subjectId) => {
    setSelectedSubjectId(subjectId)
    setSelectedChapterSlug(null)
  }
  const selectChapter = (chapterSlug) => setSelectedChapterSlug(chapterSlug)
  const resetSelection = () => {
    setSelectedSubjectId(null)
    setSelectedChapterSlug(null)
  }

  return {
    meta: topicIndexMeta,
    allTopics,
    subjects,
    chapters,
    results,
    stats,
    search,
    setSearch,
    filters,
    setFilter,
    sortKey,
    setSortKey,
    warnings: topicLoadWarnings,
    getStatus,
    setStatus,
    getTopicById: (id) => {
      const topic = getTopicById({ topics: topicRecords }, id)
      return topic ? { ...topic, status: getStatus(topic.id) } : null
    },
    getBreadcrumbForTopic,
    getStudyMap: (topic) => buildStudyMap(topic, libraryMasterIndex, pyqLibraryIndex),
    // Subject -> Chapter -> Topic navigator state.
    selectedSubjectId,
    selectedChapterSlug,
    selectedChapters,
    selectedChapterTopics,
    selectSubject,
    selectChapter,
    resetSelection,
  }
}

export default useTopicIndex
