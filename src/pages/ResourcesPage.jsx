import { useMemo, useState } from 'react'
import { getCatalogResources } from '../engine/resourceCatalogService'
import { useFavorites } from '../hooks/useFavorites'
import SearchBar from '../components/resources/SearchBar'
import ResourceGrid from '../components/resources/ResourceGrid'

/** A browse view over the same Library records that topics resolve by id. */
export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const { favoriteIds, toggleFavorite } = useFavorites()
  const allResources = useMemo(() => getCatalogResources(), [])

  const subjects = useMemo(() => {
    const ids = new Set()
    allResources.forEach((resource) => resource.usedIn.forEach((topic) => ids.add(topic.subjectId)))
    return [...ids].sort()
  }, [allResources])

  const resources = useMemo(() => {
    const query = search.trim().toLowerCase()
    return allResources.filter((resource) => {
      const inSubject = subjectId === 'all' || resource.usedIn.some((topic) => topic.subjectId === subjectId)
      const haystack = `${resource.title} ${resource.author ?? ''} ${resource.source ?? ''} ${resource.usedIn.map((topic) => topic.name).join(' ')}`.toLowerCase()
      return inSubject && (!query || haystack.includes(query))
    })
  }, [allResources, search, subjectId])

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Resources</h2>
        <p className="mt-0.5 text-xs text-[#858585]">Books and videos linked directly from the Topic Index.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} /></div>
        <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-xs text-[#cccccc]">
          <option value="all">All subjects</option>
          {subjects.map((id) => <option key={id} value={id}>{id.replaceAll('_', ' ')}</option>)}
        </select>
      </div>
      {['books', 'videos'].map((type) => {
        const items = resources.filter((resource) => resource.type === type)
        return <section key={type} className="flex flex-col gap-3">
          <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-[#e8e8e8]">{type === 'books' ? 'Books' : 'Videos'}</h3><span className="text-xs text-[#858585]">{items.length}</span></div>
          <ResourceGrid resources={items} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} emptyLabel={`No ${type} match these filters`} />
        </section>
      })}
    </div>
  )
}
