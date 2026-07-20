import { BookOpen, Video, FlaskConical, FileText, Brain, RefreshCw, NotebookPen, ListChecks } from 'lucide-react'

const ICON_MAP = {
  book: BookOpen,
  video: Video,
  pyqs: FlaskConical,
  formula: FileText,
  memory: Brain,
  recall: RefreshCw,
  notes: NotebookPen,
  task: ListChecks,
}

export default function TaskTypeIcon({ iconKey, size = 15, strokeWidth = 1.75, className = '' }) {
  const Icon = ICON_MAP[iconKey] ?? ListChecks
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />
}
