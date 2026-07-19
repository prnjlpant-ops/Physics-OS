import { useOutletContext } from 'react-router-dom'
import { BrainCircuit } from 'lucide-react'
import EmptyState from './EmptyState'

export default function SubjectActiveRecallPage() {
  const { subject } = useOutletContext()

  return (
    <EmptyState
      icon={BrainCircuit}
      title="No Active Recall cards yet"
      description={`Active Recall cards for ${subject.name} will appear here, organized by chapter.`}
    />
  )
}
