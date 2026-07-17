import { useMemo, useState } from 'react'
import { subjects } from '../constants/subjects'
import { getAllResources } from '../data/resourcesData'
import { RESOURCE_TYPE_ORDER, RESOURCE_TYPE_META } from '../constants/resourceTypes'
import { useFavorites } from '../hooks/useFavorites'
import SearchBar from '../components/resources/SearchBar'
import FilterBar from '../components/resources/FilterBar'
import ResourceGrid from '../components/resources/ResourceGrid'
import RecentlyOpened from '../components/resources/RecentlyOpened'

const TYPE_OPTIONS = RESOURCE_TYPE_ORDER.map((key) => ({
  key,
  label: RESOURCE_TYPE_META[key].label,
}))

const ALL_RESOURCES = getAllResources()
const RECENTLY_OPENED = ALL_RESOURCES.slice(0, 6)

export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [chapterSlug, setChapterSlug] = useState('all')
  const [type, setType] = useState('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const { favoriteIds, toggleFavorite } = useFavorites()

  const chapters = useMemo(() => {
    if (subjectId === 'all') return []
    return subjects.find((subject) => subject.id === subjectId)?.chapters ?? []
  }, [subjectId])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return ALL_RESOURCES.filter((resource) => {
      if (subjectId !== 'all' && resource.subjectId !== subjectId) return false
      if (chapterSlug !== 'all' && resource.chapterSlug !== chapterSlug) return false
      if (type !== 'all' && resource.type !== type) return false
      if (favoritesOnly && !favoriteIds.includes(resource.id)) return false
      if (query) {
        const haystack = `${resource.title} ${resource.subjectName} ${resource.chapterName}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [search, subjectId, chapterSlug, type, favoritesOnly, favoriteIds])

  const favoriteResources = useMemo(
    () => ALL_RESOURCES.filter((resource) => favoriteIds.includes(resource.id)),
    [favoriteIds],
  )

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Resources</h2>
        <p className="mt-0.5 text-xs text-[#858585]">
          The central library for every subject and chapter.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar
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
          type={type}
          onTypeChange={setType}
          typeOptions={TYPE_OPTIONS}
        />
        <label className="flex w-fit items-center gap-2 text-xs text-[#9d9d9d]">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => setFavoritesOnly(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-[#3c3c3c] bg-[#1e1e1e] accent-[#0e639c]"
          />
          Favorites only
        </label>
      </div>

      {!favoritesOnly && favoriteResources.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Favorites</h3>
          <RecentlyOpened items={favoriteResources.slice(0, 6)} />
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Recently Opened</h3>
        <RecentlyOpened items={RECENTLY_OPENED} />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">All Resources</h3>
          <span className="text-xs text-[#858585]">{filtered.length} results</span>
        </div>
        <ResourceGrid
          resources={filtered}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          showChapter
          emptyLabel="No resources match your search"
        />
      </section>
    </div>
  )
}
