import { useOutletContext } from 'react-router-dom'
import { Library } from 'lucide-react'
import EmptyState from './EmptyState'

export default function SubjectBooksPage() {
  const { subject } = useOutletContext()

  return (
    <EmptyState
      icon={Library}
      title="No books added yet"
      description={`Books for ${subject.name} will appear here.`}
    />
  )
}
