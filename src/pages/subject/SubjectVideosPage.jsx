import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getResourcesForSubject } from '../../engine/resourceCatalogService'
import { useFavorites } from '../../hooks/useFavorites'
import ResourceGrid from '../../components/resources/ResourceGrid'

export default function SubjectVideosPage() {
  const { subject } = useOutletContext()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const videos = useMemo(() => getResourcesForSubject(subject.id).filter((item) => item.type === 'videos'), [subject.id])
  return <ResourceGrid resources={videos} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} showChapter emptyLabel={`No videos mapped to ${subject.name} yet`} />
}
