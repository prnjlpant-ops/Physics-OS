import { Link } from 'react-router-dom'
import { ArrowLeft, FolderTree, RotateCcw } from 'lucide-react'
import { useLibrary } from '../../hooks/useLibrary'
import { useLibrarySettings } from '../../hooks/useLibrarySettings'
import { LIBRARY_SORT_OPTIONS } from '../../constants/libraryConstants'

export default function LibrarySettingsPage() {
  const { config, subjects } = useLibrary()
  const { defaultSorting, defaultSubject, updateSettings, resetSettings } = useLibrarySettings()

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link to="/library" className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]">
          <ArrowLeft size={14} strokeWidth={1.75} />
          Library
        </Link>
        <h2 className="mt-3 text-lg font-semibold text-[#e8e8e8]">Knowledge Base Settings</h2>
        <p className="mt-0.5 text-xs text-[#858585]">Local preferences for the Library module.</p>
      </div>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="flex items-center gap-2">
          <FolderTree size={15} strokeWidth={1.75} className="text-[#858585]" />
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Knowledge Base Root Path</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
          Read-only placeholder, sourced from <code className="text-[#9d9d9d]">knowledge_base.json</code>. A future
          sprint can make this editable and wire it into real file-system integration.
        </p>
        <p className="mt-3 truncate rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 font-mono text-xs text-[#9d9d9d]">
          {config.root || 'Not configured'}
        </p>
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Default Sorting</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">Applied whenever the Library page loads.</p>
        <select
          value={defaultSorting}
          onChange={(event) => updateSettings({ defaultSorting: event.target.value })}
          className="mt-3 w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#cccccc] outline-none transition-colors duration-150 focus:border-[#0e639c]"
        >
          {LIBRARY_SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Default Subject</h3>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">Pre-selects a subject filter when the Library page loads.</p>
        <select
          value={defaultSubject}
          onChange={(event) => updateSettings({ defaultSubject: event.target.value })}
          className="mt-3 w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#cccccc] outline-none transition-colors duration-150 focus:border-[#0e639c]"
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </section>

      <button
        type="button"
        onClick={resetSettings}
        className="flex w-fit items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
      >
        <RotateCcw size={12} strokeWidth={1.75} />
        Reset to Defaults
      </button>
    </div>
  )
}
