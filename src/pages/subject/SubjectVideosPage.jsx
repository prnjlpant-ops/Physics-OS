import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getResourcesForSubject } from '../../engine/resourceCatalogService'
import ResourceGrid from '../../components/resources/ResourceGrid'

export default function SubjectVideosPage() {
  const { subject } = useOutletContext()
  const videos = useMemo(() => getResourcesForSubject(subject.id).filter((item) => item.type === 'videos'), [subject.id])

  return (
    <ResourceGrid
      resources={videos}
      favoriteIds={[]}
      onToggleFavorite={() => {}}
      showChapter
      emptyLabel="No lecture videos mapped to this subject yet"
    />
  )
}
