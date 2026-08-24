import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getSubjectResources } from '../../data/resourcesData'
import { useFavorites } from '../../hooks/useFavorites'
import ResourceGrid from '../../components/resources/ResourceGrid'

export default function SubjectBooksPage() {
  const { subject } = useOutletContext()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const books = useMemo(() => {
    const seen = new Set()
    return getSubjectResources(subject).filter((item) => item.type === 'books' && !seen.has(item.title) && seen.add(item.title))
  }, [subject])
  return <ResourceGrid resources={books} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} emptyLabel={`No books mapped to ${subject.name} yet`} />
}
