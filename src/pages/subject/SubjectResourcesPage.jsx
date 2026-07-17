import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getSubjectResources } from '../../data/resourcesData'
import { RESOURCE_TYPE_ORDER, RESOURCE_TYPE_META } from '../../constants/resourceTypes'
import { useFavorites } from '../../hooks/useFavorites'
import SearchBar from '../../components/resources/SearchBar'
import FilterBar from '../../components/resources/FilterBar'
import ResourceGrid from '../../components/resources/ResourceGrid'

const TYPE_OPTIONS = RESOURCE_TYPE_ORDER.map((key) => ({
  key,
  label: RESOURCE_TYPE_META[key].label,
}))

export default function SubjectResourcesPage() {
  const { subject } = useOutletContext()
  const [search, setSearch] = useState('')
  const [chapterSlug, setChapterSlug] = useState('all')
  const [type, setType] = useState('all')
  const { favoriteIds, toggleFavorite } = useFavorites()

  const allResources = useMemo(() => getSubjectResources(subject), [subject])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return allResources.filter((resource) => {
      if (chapterSlug !== 'all' && resource.chapterSlug !== chapterSlug) return false
      if (type !== 'all' && resource.type !== type) return false
      if (query && !`${resource.title} ${resource.chapterName}`.toLowerCase().includes(query)) {
        return false
      }
      return true
    })
  }, [allResources, search, chapterSlug, type])

  return (
    <div className="flex flex-col gap-4">
      <SearchBar value={search} onChange={setSearch} placeholder={`Search ${subject.name} resources...`} />
      <FilterBar
        hideSubject
        chapters={subject.chapters}
        chapterSlug={chapterSlug}
        onChapterChange={setChapterSlug}
        type={type}
        onTypeChange={setType}
        typeOptions={TYPE_OPTIONS}
      />
      <ResourceGrid
        resources={filtered}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        showChapter
        emptyLabel="No resources match your search"
      />
    </div>
  )
}
