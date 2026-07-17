import { FileStack } from 'lucide-react'
import EmptyState from '../../pages/subject/EmptyState'
import ResourceCard from './ResourceCard'

export default function ResourceGrid({
  resources,
  favoriteIds,
  onToggleFavorite,
  showChapter = false,
  emptyLabel = 'No resources found',
}) {
  if (resources.length === 0) {
    return <EmptyState icon={FileStack} title={emptyLabel} />
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          isFavorite={favoriteIds.includes(resource.id)}
          onToggleFavorite={onToggleFavorite}
          showChapter={showChapter}
        />
      ))}
    </div>
  )
}
