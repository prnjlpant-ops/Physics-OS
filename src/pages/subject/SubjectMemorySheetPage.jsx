import { useOutletContext } from 'react-router-dom'
import { Brain } from 'lucide-react'
import EmptyState from './EmptyState'

export default function SubjectMemorySheetPage() {
  const { subject } = useOutletContext()

  return (
    <EmptyState
      icon={Brain}
      title="No memory sheet yet"
      description={`A memory sheet for ${subject.name} will appear here.`}
    />
  )
}
