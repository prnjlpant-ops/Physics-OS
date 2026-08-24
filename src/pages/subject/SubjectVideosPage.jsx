import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getSubjectResources } from '../../data/resourcesData'
import { useFavorites } from '../../hooks/useFavorites'
import ResourceGrid from '../../components/resources/ResourceGrid'

export default function SubjectVideosPage() {
  const { subject } = useOutletContext()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const videos = useMemo(() => getSubjectResources(subject).filter((item) => item.type === 'videos'), [subject])
  return <ResourceGrid resources={videos} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} showChapter emptyLabel={`No videos mapped to ${subject.name} yet`} />
}
