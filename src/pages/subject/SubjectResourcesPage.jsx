import { Library, Video, FileStack, BookMarked } from 'lucide-react'
import EmptyState from './EmptyState'

const SECTIONS = [
  { label: 'Books', icon: Library },
  { label: 'Videos', icon: Video },
  { label: 'Reference Material', icon: FileStack },
  { label: 'Solution Manual', icon: BookMarked },
]

export default function SubjectResourcesPage() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SECTIONS.map(({ label, icon: Icon }) => (
        <section key={label}>
          <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">{label}</h3>
          <EmptyState icon={Icon} title={`No ${label.toLowerCase()} added yet`} />
        </section>
      ))}
    </div>
  )
}
