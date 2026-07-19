import { Link } from 'react-router-dom'
import {
  Library,
  NotebookPen,
  FileText,
  Brain,
  FlaskConical,
  ClipboardCheck,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

const LINKED_MODULE_DEFINITIONS = [
  { key: 'resources', label: 'Resources', icon: Library },
  { key: 'notes', label: 'Notes', icon: NotebookPen },
  { key: 'formulaSheet', label: 'Formula Sheets', icon: FileText },
  { key: 'memorySheet', label: 'Memory Sheets', icon: Brain },
  { key: 'pyqs', label: 'PYQs', icon: FlaskConical },
  { key: 'mockTests', label: 'Mock Tests', icon: ClipboardCheck },
  { key: 'activeRecall', label: 'Active Recall', icon: RefreshCw },
  { key: 'errorLearning', label: 'Error Learning', icon: AlertTriangle },
]

export default function LinkedModulesPanel({ linkedModules }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {LINKED_MODULE_DEFINITIONS.map(({ key, label, icon: Icon }) => (
        <Link
          key={key}
          to={linkedModules[key]}
          className="flex flex-col items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2 py-3 text-center transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#2d2d2d]"
        >
          <Icon size={16} strokeWidth={1.75} className="text-[#858585]" />
          <span className="text-[10px] text-[#cccccc]">{label}</span>
        </Link>
      ))}
    </div>
  )
}
