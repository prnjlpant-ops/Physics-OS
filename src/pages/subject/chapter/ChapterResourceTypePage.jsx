import { useOutletContext } from 'react-router-dom'
import { useFavorites } from '../../../hooks/useFavorites'
import { RESOURCE_TYPE_META } from '../../../constants/resourceTypes'
import ResourceGrid from '../../../components/resources/ResourceGrid'

export default function ChapterResourceTypePage({ type }) {
  const { resources } = useOutletContext()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const meta = RESOURCE_TYPE_META[type]

  return (
    <ResourceGrid
      resources={resources[type]}
      favoriteIds={favoriteIds}
      onToggleFavorite={toggleFavorite}
      emptyLabel={`No ${meta.label.toLowerCase()} added yet`}
    />
  )
}
