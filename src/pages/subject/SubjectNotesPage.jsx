import { useOutletContext } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'
import EmptyState from './EmptyState'

export default function SubjectNotesPage() {
  const { subject } = useOutletContext()

  return (
    <EmptyState
      icon={NotebookPen}
      title="No notes added yet"
      description={`Notes for ${subject.name} will appear here.`}
    />
  )
}
