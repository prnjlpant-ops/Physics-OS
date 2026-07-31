import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { navigationItems } from '../constants/navigation'
import DesktopService from '../services/DesktopService'

const SIDEBAR_COLLAPSE_STORAGE_KEY = 'physicsOS.sidebarCollapsed'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const loadCollapsedState = async () => {
      if (DesktopService.isElectronReady() && window.physicsOSDesktop?.workspace?.getState) {
        try {
          const state = await window.physicsOSDesktop.workspace.getState()
          if (typeof state.sidebarCollapsed === 'boolean') {
            setCollapsed(state.sidebarCollapsed)
            return
          }
        } catch {
          // Ignore and fall back to local storage.
        }
      }

      try {
        const stored = localStorage.getItem(SIDEBAR_COLLAPSE_STORAGE_KEY)
        if (stored === 'true') setCollapsed(true)
        else if (stored === 'false') setCollapsed(false)
      } catch {
        // Ignore storage errors.
      }
    }

    loadCollapsedState()
  }, [])

  const setCollapsedState = async (nextCollapsed) => {
    setCollapsed(nextCollapsed)

    if (DesktopService.isElectronReady() && window.physicsOSDesktop?.workspace?.setState) {
      try {
        await window.physicsOSDesktop.workspace.setState({ sidebarCollapsed: nextCollapsed })
      } catch {
        // Ignore persistence failures.
      }
      return
    }

    try {
      localStorage.setItem(SIDEBAR_COLLAPSE_STORAGE_KEY, String(nextCollapsed))
    } catch {
      // Ignore storage failures.
    }
  }

  const toggleCollapsed = () => {
    setCollapsedState(!collapsed)
  }

  return (
    <aside
      className={
        'hidden h-full shrink-0 flex-col border-r border-[#3c3c3c] bg-[#252526] md:flex ' +
        (collapsed ? 'w-16' : 'w-56')
      }
    >
      <div
        className={
          'flex h-12 shrink-0 items-center border-b border-[#3c3c3c] px-4 ' +
          (collapsed ? 'justify-center' : 'justify-between')
        }
      >
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-[#cccccc]">
            Physics OS
          </span>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="rounded p-1.5 text-[#cccccc] transition-colors duration-150 hover:bg-[#3c3c3c] hover:text-[#ffffff]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
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
