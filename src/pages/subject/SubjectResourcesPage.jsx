import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getResourcesForSubject } from '../../engine/resourceCatalogService'
import { useFavorites } from '../../hooks/useFavorites'
import ResourceGrid from '../../components/resources/ResourceGrid'

export default function SubjectResourcesPage() {
  const { subject } = useOutletContext()
  const [search, setSearch] = useState('')
  const { favoriteIds, toggleFavorite } = useFavorites()
  const resources = useMemo(() => getResourcesForSubject(subject.id).filter((resource) => {
    const query = search.trim().toLowerCase()
    return !query || `${resource.title} ${resource.author ?? ''} ${resource.usedIn.map((topic) => topic.name).join(' ')}`.toLowerCase().includes(query)
  }), [subject.id, search])

  return <div className="flex flex-col gap-3">
    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${subject.name} resources`} className="rounded border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#cccccc] outline-none" />
    <ResourceGrid resources={resources} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} showChapter emptyLabel={`No directly linked resources for ${subject.name} yet`} />
  </div>
}
