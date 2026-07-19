import { NavLink, Outlet } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

const TABS = [
  { label: 'Dashboard', to: '.' },
  { label: 'Error Library', to: 'library' },
  { label: 'Weak Topics', to: 'weak-topics' },
  { label: 'Statistics', to: 'statistics' },
  { label: 'Revision Queue', to: 'revision-queue' },
]

export default function ErrorLearningLayout() {
  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc]">
          <AlertTriangle size={22} strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[#e8e8e8]">Error Learning</h2>
          <p className="text-xs text-[#858585]">
            Turn mistakes from PYQs, Mocks and practice into structured, revisable learning.
          </p>
        </div>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-[#3c3c3c] px-1 pb-px">
        {TABS.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            end={tab.to === '.'}
            className={({ isActive }) =>
              [
                'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors duration-150',
                isActive
                  ? 'border-[#0e639c] text-[#e8e8e8]'
                  : 'border-transparent text-[#9d9d9d] hover:text-[#cccccc]',
              ].join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
