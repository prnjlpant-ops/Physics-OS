import { NavLink } from 'react-router-dom'
import { navigationItems } from '../constants/navigation'

export default function Sidebar() {
  return (
    <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-[#3c3c3c] bg-[#252526] md:flex">
      <div className="flex h-12 shrink-0 items-center border-b border-[#3c3c3c] px-4">
        <span className="text-sm font-semibold tracking-wide text-[#cccccc]">
          Physics OS
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col gap-0.5 px-2">
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 rounded px-2.5 py-1.5 text-sm transition-colors duration-150',
                    isActive
                      ? 'bg-[#37373d] text-[#ffffff]'
                      : 'text-[#cccccc] hover:bg-[#2a2d2e] hover:text-[#ffffff]',
                  ].join(' ')
                }
              >
                <Icon size={16} strokeWidth={1.75} className="shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
