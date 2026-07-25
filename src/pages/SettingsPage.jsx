import { Link } from 'react-router-dom'
import { FolderTree, RotateCcw, Database, ChevronRight } from 'lucide-react'
import { useKnowledgeBaseSettings } from '../hooks/useKnowledgeBaseSettings'
import { useMasterIndex } from '../context/MasterIndexProvider'
import {
  KNOWLEDGE_BASE_CATEGORY_ORDER,
  KNOWLEDGE_BASE_CATEGORY_META,
  KNOWLEDGE_BASE_ROOT_PATH_PLACEHOLDER,
} from '../constants/knowledgeBaseConstants'
import { RESOURCE_STATUS } from '../constants/masterIndexConstants'
import { normalizeRootPath, isRootPathConfigured } from '../engine/knowledgeBaseService'

function countResources(masterIndex) {
  const subjectEntries = Object.values(masterIndex?.subjects ?? {})
  let total = 0
  let notAdded = 0

  subjectEntries.forEach((entry) => {
    KNOWLEDGE_BASE_CATEGORY_ORDER.forEach((categoryKey) => {
      const resources = entry.categories?.[categoryKey] ?? []
      total += resources.length
      notAdded += resources.filter((resource) => resource.status === RESOURCE_STATUS.NOT_ADDED).length
    })
  })

  return { total, notAdded }
}

export default function SettingsPage() {
  const { rootPath, setRootPath, resetRootPath } = useKnowledgeBaseSettings()
  const { masterIndex } = useMasterIndex()
  const isConfigured = isRootPathConfigured(rootPath)
  const normalizedRoot = normalizeRootPath(rootPath)
  const { total, notAdded } = countResources(masterIndex)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Settings</h2>
        <p className="mt-1 text-xs text-[#858585]">Local preferences for Physics OS.</p>
      </div>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree size={15} strokeWidth={1.75} className="text-[#858585]" />
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Knowledge Base</h3>
          </div>
          <button
            type="button"
            onClick={resetRootPath}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            Clear
          </button>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
          Points Physics OS at the folder where your Knowledge Base lives on disk. Stored
          locally — nothing is scanned or uploaded.
        </p>

        <label className="mt-3 flex flex-col gap-1.5">
          <span className="text-[11px] text-[#9d9d9d]">Knowledge Base Root Path</span>
          <input
            type="text"
            value={rootPath}
            onChange={(event) => setRootPath(event.target.value)}
            placeholder={KNOWLEDGE_BASE_ROOT_PATH_PLACEHOLDER}
            spellCheck={false}
            className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 font-mono text-sm text-[#e8e8e8] outline-none transition-colors duration-150 placeholder:text-[#6e6e6e] focus:border-[#0e639c]"
          />
        </label>

        {isConfigured ? (
          <div className="mt-3 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] p-3">
            <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">
              Example — Classical Mechanics
            </p>
            <p className="mt-1 truncate font-mono text-[11px] text-[#9d9d9d]">
              {normalizedRoot}\Classical Mechanics\{KNOWLEDGE_BASE_CATEGORY_META.books.label}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-[#6e6e6e]">
              Every subject gets a folder here, and every subject folder gets one folder per
              resource category below. Changing the root updates every generated path
              immediately.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-[11px] text-[#6e6e6e]">
            Set a root path to see it reflected on every Subject&apos;s Knowledge Base tab.
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#3c3c3c] pt-3">
          {KNOWLEDGE_BASE_CATEGORY_ORDER.map((categoryKey) => (
            <span
              key={categoryKey}
              className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-[10px] text-[#9d9d9d]"
            >
              {KNOWLEDGE_BASE_CATEGORY_META[categoryKey].label}
            </span>
          ))}
        </div>
      </section>

      <Link
        to="/settings/master-index"
        className="flex items-center justify-between rounded-lg border border-[#3c3c3c] bg-[#252526] p-4 transition-colors duration-150 hover:border-[#4a4a4a]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
            <Database size={17} strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Master Index</h3>
            <p className="mt-0.5 text-[11px] text-[#858585]">
              {total} resource{total === 1 ? '' : 's'} tracked · {notAdded} not added ·
              Import / Export
            </p>
          </div>
        </div>
        <ChevronRight size={16} strokeWidth={1.75} className="shrink-0 text-[#6e6e6e]" />
      </Link>
    </div>
  )
}
