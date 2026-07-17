import { Link } from 'react-router-dom'
import {
  BookOpen,
  FileText,
  Brain,
  FlaskConical,
  Library,
  NotebookPen,
} from 'lucide-react'

const quickAccessItems = [
  { label: 'Subjects', path: '/subjects', icon: BookOpen },
  { label: 'Resources', path: '/resources', icon: Library },
  { label: 'PYQs', path: '/pyqs', icon: FlaskConical },
  { label: 'Formula Sheets', path: '/formula-sheets', icon: FileText },
  { label: 'Memory Sheets', path: '/memory-sheets', icon: Brain },
  { label: 'Notes', path: '/notes', icon: NotebookPen },
]

export default function QuickAccess() {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Quick Access</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {quickAccessItems.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 text-sm text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#2d2d2d] hover:text-[#e8e8e8]"
          >
            <Icon size={18} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
