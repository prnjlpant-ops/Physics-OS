import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderTree,
  RotateCcw,
  Database,
  ChevronRight,
  Target,
  Monitor,
  History,
  Download,
  Upload,
  Trash2,
} from 'lucide-react'
import { useKnowledgeBaseSettings } from '../hooks/useKnowledgeBaseSettings'
import { useStudyPreferences } from '../hooks/useStudyPreferences'
import { useRecentItems } from '../hooks/useRecentItems'
import { useMasterIndex } from '../context/MasterIndexProvider'
import {
  KNOWLEDGE_BASE_CATEGORY_ORDER,
  KNOWLEDGE_BASE_CATEGORY_META,
  KNOWLEDGE_BASE_ROOT_PATH_PLACEHOLDER,
} from '../constants/knowledgeBaseConstants'
import { RESOURCE_STATUS } from '../constants/masterIndexConstants'
import { normalizeRootPath, isRootPathConfigured } from '../engine/knowledgeBaseService'
import DesktopService from '../services/DesktopService'
import ExportService from '../services/ExportService'
import ImportService from '../services/ImportService'
import DialogService from '../services/DialogService'
import NotificationService from '../services/NotificationService'

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

const ENVIRONMENT_LABELS = {
  browser: 'Browser',
  electron: 'Electron',
  unknown: 'Unknown',
}

export default function SettingsPage() {
  const { rootPath, setRootPath, resetRootPath } = useKnowledgeBaseSettings()
  const { settings, updatePreference } = useStudyPreferences()
  const { masterIndex } = useMasterIndex()
  const recentItems = useRecentItems()
  const isConfigured = isRootPathConfigured(rootPath)
  const normalizedRoot = normalizeRootPath(rootPath)
  const { total, notAdded } = countResources(masterIndex)

  const importInputRef = useRef(null)
  const environment = DesktopService.getEnvironment()
  const recentCount =
    (recentItems.resources?.length ?? 0) +
    (recentItems.topics?.length ?? 0) +
    (recentItems.books?.length ?? 0) +
    (recentItems.papers?.length ?? 0)

  const handleExport = async () => {
    const confirmed = await DialogService.confirmExport(
      'Export Study Sessions, Tasks, Bookmarks, Progress, and Settings as a JSON file?',
    )
    if (!confirmed) return

    const { success } = ExportService.exportCategories(ExportService.EXPORT_CATEGORIES, 'physics-os-export.json')
    if (success) {
      NotificationService.success('Export downloaded.')
    } else {
      NotificationService.error('Export failed — could not create the download.')
    }
  }

  const handleImportClick = () => importInputRef.current?.click()

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const { success, error, payload } = await ImportService.importFromFile(file)
    if (!success) {
      NotificationService.error(error ?? 'Could not read that file.')
      return
    }

    const confirmed = await DialogService.confirmImport(
      `Import data from "${file.name}"? Existing data with the same keys will be overwritten.`,
    )
    if (!confirmed) return

    const { applied } = ImportService.applyPayload(payload)
    NotificationService.success(`Imported ${applied} item${applied === 1 ? '' : 's'}.`)
  }

  const handleClearRecent = async () => {
    const confirmed = await DialogService.confirmDelete('Recent Items')
    if (!confirmed) return
    recentItems.clear()
    NotificationService.success('Recent items cleared.')
  }

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

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="flex items-center gap-2">
          <Target size={15} strokeWidth={1.75} className="text-[#858585]" />
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Study Preferences</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
          Applied across Today&apos;s Mission and the Study Session workspace. Stored locally.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[#9d9d9d]">Daily Study Goal (minutes)</span>
            <input
              type="number"
              min={15}
              step={15}
              value={settings.dailyStudyGoalMinutes}
              onChange={(event) => updatePreference('dailyStudyGoalMinutes', Number(event.target.value))}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[#9d9d9d]">Default Subject</span>
            <input
              type="text"
              value={settings.defaultSubject}
              onChange={(event) => updatePreference('defaultSubject', event.target.value)}
              placeholder="e.g. Quantum Mechanics"
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-[#3c3c3c] pt-3">
          <label className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-[#9d9d9d]">Auto Save Notes</span>
            <input
              type="checkbox"
              checked={settings.autoSaveNotes}
              onChange={(event) => updatePreference('autoSaveNotes', event.target.checked)}
              className="h-4 w-4 accent-[#0e639c]"
            />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-[#9d9d9d]">Remember Last Topic</span>
            <input
              type="checkbox"
              checked={settings.rememberLastTopic}
              onChange={(event) => updatePreference('rememberLastTopic', event.target.checked)}
              className="h-4 w-4 accent-[#0e639c]"
            />
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor size={15} strokeWidth={1.75} className="text-[#858585]" />
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Desktop</h3>
          </div>
          <span className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-[10px] text-[#9d9d9d]">
            Running in {ENVIRONMENT_LABELS[environment] ?? 'Unknown'}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
          Prepares Physics OS for a future Electron desktop build. Everything here still runs
          fully in the browser — see Sprint 29 for native desktop features.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[#9d9d9d]">Maximum Recent Items</span>
            <input
              type="number"
              min={1}
              max={50}
              value={settings.maxRecentItems}
              onChange={(event) => updatePreference('maxRecentItems', Number(event.target.value))}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[#9d9d9d]">Default Export Folder</span>
            <input
              type="text"
              value={settings.defaultExportFolder}
              disabled
              placeholder="Available once Physics OS runs as a desktop app"
              className="w-full cursor-not-allowed rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#6e6e6e] outline-none placeholder:text-[#5a5a5a]"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-[#3c3c3c] pt-3">
          <label className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-[#9d9d9d]">Restore Last Workspace</span>
            <input
              type="checkbox"
              checked={settings.restoreLastWorkspace}
              onChange={(event) => updatePreference('restoreLastWorkspace', event.target.checked)}
              className="h-4 w-4 accent-[#0e639c]"
            />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-[#9d9d9d]">Open Resources In New Tab</span>
            <input
              type="checkbox"
              checked={settings.openResourcesInNewTab}
              onChange={(event) => updatePreference('openResourcesInNewTab', event.target.checked)}
              className="h-4 w-4 accent-[#0e639c]"
            />
          </label>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#3c3c3c] pt-3">
          <div className="flex items-center gap-2">
            <History size={14} strokeWidth={1.75} className="text-[#858585]" />
            <span className="text-[11px] text-[#9d9d9d]">
              {recentCount} recent item{recentCount === 1 ? '' : 's'} tracked
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearRecent}
            disabled={recentCount === 0}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={12} strokeWidth={1.75} />
            Clear Recent
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 border-t border-[#3c3c3c] pt-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <Download size={13} strokeWidth={1.75} />
            Export Data
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <Upload size={13} strokeWidth={1.75} />
            Import Data
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-[#6e6e6e]">
          Export/Import covers Study Sessions, Tasks, Bookmarks, Progress, and Settings — not the
          Master Index (use Master Index → Import/Export above for that).
        </p>
      </section>
    </div>
  )
}
