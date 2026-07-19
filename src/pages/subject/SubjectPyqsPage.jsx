import { useOutletContext } from 'react-router-dom'
import { FlaskConical } from 'lucide-react'
import EmptyState from './EmptyState'

export default function SubjectPyqsPage() {
  const { subject } = useOutletContext()

  return (
    <EmptyState
      icon={FlaskConical}
      title="No PYQs added yet"
      description={`Previous year questions for ${subject.name} will appear here.`}
    />
  )
}
