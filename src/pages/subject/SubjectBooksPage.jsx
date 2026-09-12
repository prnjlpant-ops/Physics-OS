import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getResourcesForSubject } from '../../engine/resourceCatalogService'
import BookShelf from '../../components/books/BookShelf'

export default function SubjectBooksPage() {
  const { subject } = useOutletContext()
  const books = useMemo(() => {
    const seen = new Set()
    return getResourcesForSubject(subject.id).filter((item) => item.type === 'books' && !seen.has(item.id) && seen.add(item.id))
  }, [subject])

  return <BookShelf books={books} />
}
