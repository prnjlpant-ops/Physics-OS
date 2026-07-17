import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navigationItems } from '../constants/navigation'

export default function TopBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  const currentPage =
    navigationItems.find((item) =>
      item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
    )?.label ?? 'Physics OS'

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-[#3c3c3c] bg-[#2d2d2d] px-4 print:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded p-1.5 text-[#cccccc] transition-colors duration-150 hover:bg-[#3c3c3c] hover:text-[#ffffff] md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <h1 className="truncate text-sm font-medium text-[#cccccc]">
          {currentPage}
        </h1>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="relative flex h-full w-64 flex-col border-r border-[#3c3c3c] bg-[#252526]">
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
                      onClick={() => setMobileOpen(false)}
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
        </div>
      )}
    </>
  )
}
