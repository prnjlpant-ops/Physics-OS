import { useOutletContext } from 'react-router-dom'
import { FileText } from 'lucide-react'
import EmptyState from './EmptyState'

export default function SubjectFormulaSheetPage() {
  const { subject } = useOutletContext()

  return (
    <EmptyState
      icon={FileText}
      title="No formula sheet yet"
      description={`A formula sheet for ${subject.name} will appear here.`}
    />
  )
}
