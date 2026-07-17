import { useOutletContext } from 'react-router-dom'
import { Video } from 'lucide-react'
import EmptyState from './EmptyState'

export default function SubjectVideosPage() {
  const { subject } = useOutletContext()

  return (
    <EmptyState
      icon={Video}
      title="No videos added yet"
      description={`Video lectures for ${subject.name} will appear here.`}
    />
  )
}
