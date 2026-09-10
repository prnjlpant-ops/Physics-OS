import { useMemo, useState } from 'react'
import { getCatalogResources } from '../engine/resourceCatalogService'
import { useFavorites } from '../hooks/useFavorites'
import SearchBar from '../components/resources/SearchBar'
import ResourceGrid from '../components/resources/ResourceGrid'

function groupResourcesBySubjectAndChapter(resources) {
  const groups = new Map()

  resources.forEach((resource) => {
    const subjectName = resource.subjectName || resource.usedIn?.[0]?.subjectName || 'Unassigned'
    const chapterName = resource.chapterName || resource.usedIn?.[0]?.chapter || 'General'
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

  const groupedByType = useMemo(() => {
    const byType = {}
    ;['books', 'videos'].forEach((type) => {
      byType[type] = groupResourcesBySubjectAndChapter(resources.filter((resource) => resource.type === type))
    })
    return byType
  }, [resources])

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Resources</h2>
        <p className="mt-0.5 text-xs text-[#858585]">Books and videos linked directly from the Topic Index, grouped chapter-wise for faster study.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} /></div>
        <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-xs text-[#cccccc]">
          <option value="all">All subjects</option>
          {subjects.map((id) => <option key={id} value={id}>{id.replaceAll('_', ' ')}</option>)}
        </select>
      </div>
      {['books', 'videos'].map((type) => {
        const groups = groupedByType[type] ?? []
        return (
          <section key={type} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#e8e8e8]">{type === 'books' ? 'Books' : 'Videos'}</h3>
              <span className="text-xs text-[#858585]">{groups.reduce((sum, group) => sum + group.items.length, 0)}</span>
            </div>
            {groups.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#3c3c3c] px-4 py-8 text-center text-xs text-[#6e6e6e]">No {type} match these filters</div>
            ) : (
              <div className="flex flex-col gap-4">
                {groups.map((group) => (
                  <div key={`${group.subjectName}-${group.chapterName}`} className="rounded-lg border border-[#3c3c3c] bg-[#1f1f1f] p-3">
                    <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#3c3c3c] pb-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[#858585]">{group.subjectName}</p>
                        <h4 className="mt-1 text-sm font-semibold text-[#e8e8e8]">{group.chapterName}</h4>
                      </div>
                      <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-1 text-[10px] text-[#9d9d9d]">{group.items.length}</span>
                    </div>
                    <ResourceGrid resources={group.items} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} showChapter emptyLabel="No resources in this chapter" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
