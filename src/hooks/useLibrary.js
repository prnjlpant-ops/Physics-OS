import { useEffect, useMemo, useState } from 'react'
import { libraryMasterIndex, libraryConfig, libraryLoadWarnings } from '../engine/library'
import { getAllResources, getSubjects, getResourceById, getIndexStats } from '../engine/library/masterIndexService'
import { queryResources, getDistinctAuthors } from '../engine/library/searchService'
import { DEFAULT_LIBRARY_SORT } from '../constants/libraryConstants'
import { useLibrarySettings } from './useLibrarySettings'

/**
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * The main hook every Library page/component uses. Wraps the (static,
 * built-once) Master Index with the bits of state a browsing UI needs:
 * search text, active filters, sort order — seeded from the user's Default
 * Sorting / Default Subject settings, per this sprint's Settings section.
 */
export function useLibrary() {
  const { defaultSorting, defaultSubject } = useLibrarySettings()
  const allResources = useMemo(() => getAllResources(libraryMasterIndex), [])
  const subjects = useMemo(() => getSubjects(libraryMasterIndex), [])
  const authors = useMemo(() => getDistinctAuthors(allResources), [allResources])

  const validDefaultSubject = defaultSubject === 'all' || subjects.some(s => s.id === defaultSubject) ? defaultSubject : 'all'

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    subjectId: validDefaultSubject,
    priority: 'all',
    categoryKey: 'all',
    author: 'all',
  })

  // Force reset if HMR leaves it stuck in a bad state
  useEffect(() => {
    if (filters.subjectId !== 'all' && !subjects.some(s => s.id === filters.subjectId)) {
      setFilters(prev => ({ ...prev, subjectId: 'all' }))
    }
  }, [subjects, filters.subjectId])

  const [sortKey, setSortKey] = useState(defaultSorting || DEFAULT_LIBRARY_SORT)

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const results = useMemo(
    () => queryResources(allResources, { query: search, filters, sortKey }),
    [allResources, search, filters, sortKey],
  )

  const stats = useMemo(() => getIndexStats(libraryMasterIndex), [])

  return {
    config: libraryConfig,
    subjects,
    authors,
    allResources,
    results,
    stats,
    search,
    setSearch,
    filters,
    setFilter,
    sortKey,
    setSortKey,
    warnings: libraryLoadWarnings,
    getResourceById: (id) => getResourceById(libraryMasterIndex, id),
  }
}
