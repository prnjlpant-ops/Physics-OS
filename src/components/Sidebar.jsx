import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { navigationItems } from '../constants/navigation'
import DesktopService from '../services/DesktopService'

const SIDEBAR_COLLAPSE_STORAGE_KEY = 'physicsOS.sidebarCollapsed'

export default function Sidebar({ collapsed: controlledCollapsed, onToggle }) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)

  useEffect(() => {
    const loadCollapsedState = async () => {
      if (DesktopService.isElectronReady() && window.physicsOSDesktop?.workspace?.getState) {
        try {
          const state = await window.physicsOSDesktop.workspace.getState()
          if (typeof state.sidebarCollapsed === 'boolean') {
            setInternalCollapsed(state.sidebarCollapsed)
            return
          }
        } catch {
          // Ignore and fall back to local storage.
        }
      }

      try {
        const stored = localStorage.getItem(SIDEBAR_COLLAPSE_STORAGE_KEY)
        if (stored === 'true') setInternalCollapsed(true)
        else if (stored === 'false') setInternalCollapsed(false)
      } catch {
        // Ignore storage errors.
      }
    }

    loadCollapsedState()
  }, [])

  const collapsed = controlledCollapsed ?? internalCollapsed

  const setCollapsedState = async (nextCollapsed) => {
    if (onToggle) {
      onToggle(nextCollapsed)
    } else {
      setInternalCollapsed(nextCollapsed)
    }

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
      // Ignore storage errors.
    }
  }

  const toggleCollapsed = () => {
    setCollapsedState(!collapsed)
  }

  return (
    <aside
      className={
        'hidden h-full shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[rgba(18,20,32,0.82)] backdrop-blur-xl md:flex transition-all duration-250 ease-out ' +
        (collapsed ? 'w-16' : 'w-64')
      }
    >
      <div
        className={
          'flex h-14 shrink-0 items-center border-b border-[var(--border-subtle)] px-3 ' +
          (collapsed ? 'justify-center' : 'justify-between')
        }
      >
        {!collapsed && (
          <span className="text-sm font-semibold tracking-[0.12em] text-[var(--text-primary)] uppercase">
            Physics OS
          </span>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="rounded-lg p-1.5 text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--text-primary)]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col gap-1 px-2">
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-[rgba(129,140,248,0.14)] text-[var(--text-primary)] shadow-[inset_0_0_0_1px_rgba(129,140,248,0.22)]'
                      : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]',
                    collapsed ? 'justify-center px-2' : '',
                  ].join(' ')
                }
              >
                <Icon size={16} strokeWidth={1.75} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
