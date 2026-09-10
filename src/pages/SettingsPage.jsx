import { useState, useEffect, useRef, useCallback } from 'react'
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
  SlidersHorizontal,
  Clock,
  BookOpen,
  AlertTriangle,
  HardDrive,
  Timer,
  FileText,
  HelpCircle,
} from 'lucide-react'
import { useKnowledgeBaseSettings } from '../hooks/useKnowledgeBaseSettings'
import { useStudyPreferences } from '../hooks/useStudyPreferences'
import { usePlannerSettings } from '../hooks/usePlannerSettings'
import { useLibrarySettings } from '../hooks/useLibrarySettings'
import { useLibrary } from '../hooks/useLibrary'
import { useRecentItems } from '../hooks/useRecentItems'
import { useMasterIndex } from '../context/MasterIndexProvider'
import {
  KNOWLEDGE_BASE_CATEGORY_ORDER,
  KNOWLEDGE_BASE_CATEGORY_META,
  KNOWLEDGE_BASE_ROOT_PATH_PLACEHOLDER,
} from '../constants/knowledgeBaseConstants'
import { LIBRARY_SORT_OPTIONS } from '../constants/libraryConstants'
import { PLANNER_SETTINGS_FIELDS } from '../constants/plannerConstants'
import { RESOURCE_STATUS } from '../constants/masterIndexConstants'
import { normalizeRootPath, isRootPathConfigured } from '../engine/knowledgeBaseService'
import { calculateDailySessionSplit } from '../engine/plannerService'
import BackupService, { SCOPES } from '../services/BackupService'
import SettingsService from '../services/SettingsService'
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
  const { settings: studyPrefs, updatePreference } = useStudyPreferences()
  const { settings: plannerSettings, updateSetting: updatePlannerSetting, resetSettings: resetPlannerSettings } = usePlannerSettings()
  const { defaultSorting, defaultSubject: libraryDefaultSubject, updateSettings: updateLibrarySettings, resetSettings: resetLibrarySettings } = useLibrarySettings()
  const { subjects: librarySubjects } = useLibrary()
  const { masterIndex } = useMasterIndex()
  const recentItems = useRecentItems()

  const [scopedCounts, setScopedCounts] = useState(BackupService.getScopedCounts)
  const refreshScopedCounts = useCallback(() => {
    setScopedCounts(BackupService.getScopedCounts())
  }, [])

  useEffect(() => {
    refreshScopedCounts()
    window.addEventListener('storage', refreshScopedCounts)
    window.addEventListener('physicsOS.studySessionsChanged', refreshScopedCounts)
    window.addEventListener('physicsOS.notesChanged', refreshScopedCounts)
    return () => {
      window.removeEventListener('storage', refreshScopedCounts)
      window.removeEventListener('physicsOS.studySessionsChanged', refreshScopedCounts)
      window.removeEventListener('physicsOS.notesChanged', refreshScopedCounts)
    }
  }, [refreshScopedCounts])

  const isConfigured = isRootPathConfigured(rootPath)
  const normalizedRoot = normalizeRootPath(rootPath)
  const { total, notAdded } = countResources(masterIndex)

  const backupInputRef = useRef(null)
  const legacyImportInputRef = useRef(null)
  const environment = DesktopService.getEnvironment()
  const desktopReady = DesktopService.capabilities().nativeDialogs

  const recentCount =
    (recentItems.resources?.length ?? 0) +
    (recentItems.topics?.length ?? 0) +
    (recentItems.books?.length ?? 0) +
    (recentItems.papers?.length ?? 0)

  // 1. App-Wide Reset
  const handleResetAppPreferences = async () => {
    const confirmed = await DialogService.confirm({
      title: 'Reset App Preferences',
      message: 'Reset all app preferences to default values? Custom study targets, layout preferences, and UI options will be restored.',
      confirmLabel: 'Reset Preferences',
      cancelLabel: 'Cancel',
      danger: true,
    })
    if (!confirmed) return

    SettingsService.resetSettings()
    NotificationService.show('App preferences reset to default values.', { type: 'success' })
  }

  // 2. Planner Reset
  const handleResetPlanner = async () => {
    const confirmed = await DialogService.confirm({
      title: 'Reset Planner Settings',
      message: 'Reset study hours, session length, and daily task limits to default settings?',
      confirmLabel: 'Reset Planner',
      cancelLabel: 'Cancel',
    })
    if (!confirmed) return

    resetPlannerSettings()
    NotificationService.success('Planner settings reset to defaults.')
  }

  // 3. Knowledge Base & Library Resets
  const handleBrowseKnowledgeBase = async () => {
    const { canceled, path, unsupported } = await DialogService.openFolderDialog({
      title: 'Choose Knowledge Base folder',
    })

    if (unsupported) {
      NotificationService.error('Native folder browsing is available only in the desktop build.')
      return
    }
    if (canceled || !path) return

    setRootPath(path)
    NotificationService.success('Knowledge Base folder selected.')
  }

  const handleResetLibrary = async () => {
    const confirmed = await DialogService.confirm({
      title: 'Reset Library Preferences',
      message: 'Reset default library sorting and subject filter to defaults?',
      confirmLabel: 'Reset Library',
      cancelLabel: 'Cancel',
    })
    if (!confirmed) return

    resetLibrarySettings()
    NotificationService.success('Library preferences reset.')
  }

  // 4. One-Click Backup Export & Import
  const handleExportBackup = () => {
    const { success, count, filename } = BackupService.exportBackup()
    if (success) {
      NotificationService.success(`Exported ${count} storage keys to ${filename}.`)
    } else {
      NotificationService.error('Backup export failed.')
    }
  }

  const handleBackupFileSelect = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const text = await file.text()
      const { success, error, payload } = BackupService.parseBackupFile(text)
      if (!success) {
        NotificationService.error(error ?? 'Could not parse backup file.')
        return
      }

      const keyCount = Object.keys(payload.data || {}).length
      const confirmed = await DialogService.confirm({
        title: 'Restore Backup Archive',
        message: `Restore ${keyCount} storage keys from "${file.name}"? Existing data will be overwritten and the app will reload.`,
        confirmLabel: 'Restore & Reload',
        cancelLabel: 'Cancel',
        danger: true,
      })
      if (!confirmed) return

      const result = BackupService.importBackup(payload, true)
      if (result.success) {
        NotificationService.success(`Restored ${result.applied} keys. Reloading app...`)
      } else {
        NotificationService.error(result.error ?? 'Failed to apply backup.')
      }
    } catch (err) {
      NotificationService.error('Failed to read file: ' + err.message)
    }
  }

  // Scoped Resets
  const handleScopedReset = async (scope, title, description) => {
    const confirmed = await DialogService.confirm({
      title,
      message: `${description} This action cannot be undone.`,
      confirmLabel: 'Proceed with Reset',
      cancelLabel: 'Cancel',
      danger: true,
    })
    if (!confirmed) return

    const { success, error } = BackupService.resetScope(scope)
    if (success) {
      refreshScopedCounts()
      NotificationService.show(`${title} completed successfully.`, { type: 'success' })
    } else {
      NotificationService.error(`Reset failed: ${error}`)
    }
  }

  // Legacy Export/Import & Native electron handlers
  const handleLegacyExport = async () => {
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

  const handleLegacyImportFile = async (event) => {
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
    refreshScopedCounts()
    NotificationService.success(`Imported ${applied} item${applied === 1 ? '' : 's'}.`)
  }

  const handleNativeExport = async () => {
    if (!desktopReady) return
    const { success, canceled, error } = await ExportService.exportCategoriesNative(
      ExportService.EXPORT_CATEGORIES,
      'physics-os-export.json',
    )
    if (success) {
      NotificationService.success('Data exported successfully.')
    } else if (!canceled) {
      NotificationService.error(error ?? 'Export failed.')
    }
  }

  const handleNativeImport = async () => {
    if (!desktopReady) return
    const { success, canceled, unsupported, error, payload } = await ImportService.importFromNative()
    if (unsupported) {
      NotificationService.error('Native import is available only in the desktop build.')
      return
    }
    if (canceled) return
    if (!success) {
      NotificationService.error(error ?? 'Could not read that file.')
      return
    }

    const confirmed = await DialogService.confirmImport(
      'Import data from the selected file? Existing data with the same keys will be overwritten.',
    )
    if (!confirmed) return

    const { applied } = ImportService.applyPayload(payload)
    refreshScopedCounts()
    NotificationService.success(`Imported ${applied} item${applied === 1 ? '' : 's'}.`)
  }

  const handleClearRecent = async () => {
    const confirmed = await DialogService.confirmDelete('Recent Items')
    if (!confirmed) return
    recentItems.clear()
    NotificationService.success('Recent items cleared.')
  }

  const plannerSplits = calculateDailySessionSplit(plannerSettings)

  return (
    <div className="flex flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3c3c3c] pb-4">
        <div>
          <h2 className="text-xl font-semibold text-[#e8e8e8]">Settings</h2>
          <p className="mt-0.5 text-xs text-[#858585]">
            Configure app preferences, study parameters, knowledge base links, and manage backups.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetAppPreferences}
          className="flex items-center gap-1.5 rounded-md border border-[#5a1d1d] bg-[#2b1d1d] px-3 py-1.5 text-xs font-medium text-[#f3b4b4] transition-colors duration-150 hover:bg-[#3c2525]"
        >
          <RotateCcw size={13} strokeWidth={1.75} />
          Reset App Preferences
        </button>
      </div>

      {/* SECTION 1: General / App Preferences */}
      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-5">
        <div className="flex items-center justify-between border-b border-[#3c3c3c] pb-3">
          <div className="flex items-center gap-2">
            <Target size={16} strokeWidth={1.75} className="text-[#4fc1ff]" />
            <h3 className="text-sm font-semibold text-[#e8e8e8]">General / App Preferences</h3>
          </div>
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-0.5 text-[10px] text-[#858585]">
            Physics OS v{studyPrefs.appVersion || '0.0.0'}
          </span>
        </div>
        <p className="mt-2 text-xs text-[#858585]">
          Study target goals, autosave flags, workspace retention, and interface behavior.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#9d9d9d]">Daily Study Goal (minutes)</span>
            <input
              type="number"
              min={15}
              step={15}
              value={studyPrefs.dailyStudyGoalMinutes ?? 240}
              onChange={(event) => updatePreference('dailyStudyGoalMinutes', Number(event.target.value))}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#9d9d9d]">Default Subject</span>
            <input
              type="text"
              value={studyPrefs.defaultSubject ?? ''}
              onChange={(event) => updatePreference('defaultSubject', event.target.value)}
              placeholder="e.g. Classical Mechanics"
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#9d9d9d]">Maximum Recent Items</span>
            <input
              type="number"
              min={1}
              max={50}
              value={studyPrefs.maxRecentItems ?? 10}
              onChange={(event) => updatePreference('maxRecentItems', Number(event.target.value))}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#9d9d9d]">Preferred Browser for Links</span>
            <select
              value={studyPrefs.preferredBrowser ?? 'system'}
              onChange={(event) => updatePreference('preferredBrowser', event.target.value)}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none focus:border-[#0e639c]"
            >
              <option value="system">System Default Browser</option>
              <option value="vivaldi">Vivaldi (when installed)</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[#3c3c3c] pt-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-md border border-[#3c3c3c]/50 bg-[#1e1e1e] p-2.5">
            <span className="text-xs text-[#cccccc]">Auto Save Notes</span>
            <input
              type="checkbox"
              checked={studyPrefs.autoSaveNotes ?? true}
              onChange={(event) => updatePreference('autoSaveNotes', event.target.checked)}
              className="h-4 w-4 accent-[#0e639c]"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-[#3c3c3c]/50 bg-[#1e1e1e] p-2.5">
            <span className="text-xs text-[#cccccc]">Remember Last Topic</span>
            <input
              type="checkbox"
              checked={studyPrefs.rememberLastTopic ?? true}
              onChange={(event) => updatePreference('rememberLastTopic', event.target.checked)}
              className="h-4 w-4 accent-[#0e639c]"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-[#3c3c3c]/50 bg-[#1e1e1e] p-2.5">
            <span className="text-xs text-[#cccccc]">Restore Last Workspace</span>
            <input
              type="checkbox"
              checked={studyPrefs.restoreLastWorkspace ?? true}
              onChange={(event) => updatePreference('restoreLastWorkspace', event.target.checked)}
              className="h-4 w-4 accent-[#0e639c]"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-[#3c3c3c]/50 bg-[#1e1e1e] p-2.5">
            <span className="text-xs text-[#cccccc]">Open Resources In New Tab</span>
            <input
              type="checkbox"
              checked={studyPrefs.openResourcesInNewTab ?? true}
              onChange={(event) => updatePreference('openResourcesInNewTab', event.target.checked)}
              className="h-4 w-4 accent-[#0e639c]"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#3c3c3c] pt-3">
          <div className="flex items-center gap-2 text-xs text-[#858585]">
            <History size={14} />
            <span>{recentCount} recent item{recentCount === 1 ? '' : 's'} recorded</span>
          </div>
          <button
            type="button"
            onClick={handleClearRecent}
            disabled={recentCount === 0}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc] disabled:opacity-40"
          >
            <Trash2 size={12} />
            Clear Recent Items
          </button>
        </div>
      </section>

      {/* SECTION 2: Planner & Study Targets */}
      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-5">
        <div className="flex items-center justify-between border-b border-[#3c3c3c] pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} strokeWidth={1.75} className="text-[#4fc1ff]" />
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Planner & Study Targets</h3>
          </div>
          <button
            type="button"
            onClick={handleResetPlanner}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            Reset Planner
          </button>
        </div>
        <p className="mt-2 text-xs text-[#858585]">
          Controls daily capacity splits, session durations, and task limits for Today&apos;s Mission and Adaptive Planner.
        </p>

        {/* Calculated Session Splits Banner */}
        <div className="mt-3 flex items-center gap-2.5 rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 px-3.5 py-2.5 text-xs text-[#4fc1ff]">
          <Clock size={15} className="shrink-0" />
          <span>
            Daily Capacity Target: <strong>{plannerSplits.targetSessions} focus session{plannerSplits.targetSessions === 1 ? '' : 's'}</strong> ({plannerSplits.sessionLength}m focus + {plannerSplits.breakLength}m break) for {plannerSplits.dailyStudyHours}h target.
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANNER_SETTINGS_FIELDS.map((field) => (
            <label key={field.key} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-[#9d9d9d]">{field.label}</span>
              <div className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 focus-within:border-[#0e639c]">
                <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={plannerSettings[field.key] ?? ''}
                  onChange={(event) => updatePlannerSetting(field.key, Number(event.target.value))}
                  className="w-full bg-transparent text-sm text-[#e8e8e8] outline-none"
                />
                <span className="shrink-0 text-[10px] text-[#6e6e6e]">{field.unit}</span>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* SECTION 3: Resource & Knowledge Base */}
      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-5">
        <div className="flex items-center justify-between border-b border-[#3c3c3c] pb-3">
          <div className="flex items-center gap-2">
            <FolderTree size={16} strokeWidth={1.75} className="text-[#4fc1ff]" />
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Resource & Knowledge Base</h3>
          </div>
          <button
            type="button"
            onClick={resetRootPath}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            Clear Root
          </button>
        </div>
        <p className="mt-2 text-xs text-[#858585]">
          Point Physics OS at your local syllabus library directory and set default resource browsing preferences.
        </p>

        {/* Knowledge Base Root Input */}
        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[#9d9d9d]">Knowledge Base Root Directory</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={rootPath}
              onChange={(event) => setRootPath(event.target.value)}
              placeholder={KNOWLEDGE_BASE_ROOT_PATH_PLACEHOLDER}
              spellCheck={false}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 font-mono text-xs text-[#e8e8e8] outline-none transition-colors duration-150 placeholder:text-[#6e6e6e] focus:border-[#0e639c]"
            />
            <button
              type="button"
              onClick={handleBrowseKnowledgeBase}
              disabled={!desktopReady}
              className="shrink-0 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] disabled:opacity-40"
            >
              Browse Folder
            </button>
          </div>
        </label>

        {isConfigured ? (
          <div className="mt-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-3">
            <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Path mapping preview — Classical Mechanics</p>
            <p className="mt-1 truncate font-mono text-[11px] text-[#9d9d9d]">
              {normalizedRoot}\Classical Mechanics\{KNOWLEDGE_BASE_CATEGORY_META.books.label}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-[#6e6e6e]">
            Set a root directory to see resolved paths across each subject&apos;s Knowledge Base tabs.
          </p>
        )}

        {/* Library Sorting & Subject Defaults */}
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[#3c3c3c] pt-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#9d9d9d]">Library Default Sorting</span>
            <select
              value={defaultSorting}
              onChange={(event) => updateLibrarySettings({ defaultSorting: event.target.value })}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none focus:border-[#0e639c]"
            >
              {LIBRARY_SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#9d9d9d]">Library Default Subject</span>
            <select
              value={libraryDefaultSubject}
              onChange={(event) => updateLibrarySettings({ defaultSubject: event.target.value })}
              className="w-full rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-sm text-[#e8e8e8] outline-none focus:border-[#0e639c]"
            >
              <option value="all">All Subjects</option>
              {librarySubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleResetLibrary}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
          >
            <RotateCcw size={12} />
            Reset Library Preferences
          </button>
        </div>

        {/* Master Index Navigation Card */}
        <Link
          to="/settings/master-index"
          className="mt-4 flex items-center justify-between rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] p-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#252526] text-[#4fc1ff]">
              <Database size={16} strokeWidth={1.75} />
            </span>
            <div>
              <h4 className="text-xs font-semibold text-[#e8e8e8]">Master Index Management</h4>
              <p className="text-[11px] text-[#858585]">
                {total} resource{total === 1 ? '' : 's'} tracked · {notAdded} not added · Import / Export Master Index
              </p>
            </div>
          </div>
          <ChevronRight size={15} className="shrink-0 text-[#6e6e6e]" />
        </Link>

        {/* Recent Workspaces */}
        {recentItems.workspaces?.length > 0 && (
          <div className="mt-4 border-t border-[#3c3c3c] pt-3">
            <p className="text-[11px] font-medium text-[#9d9d9d]">Recent Workspaces</p>
            <div className="mt-2 grid gap-1.5">
              {recentItems.workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => setRootPath(workspace.path)}
                  className="w-full truncate rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-left font-mono text-[11px] text-[#cccccc] hover:border-[#4a4a4a]"
                >
                  {workspace.path}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: Backup & Data Management */}
      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-5">
        <div className="flex items-center justify-between border-b border-[#3c3c3c] pb-3">
          <div className="flex items-center gap-2">
            <HardDrive size={16} strokeWidth={1.75} className="text-[#4fc1ff]" />
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Backup & Data Management</h3>
          </div>
          <span className="rounded-full border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-0.5 text-[10px] text-[#858585]">
            Environment: {ENVIRONMENT_LABELS[environment] ?? 'Browser'}
          </span>
        </div>
        <p className="mt-2 text-xs text-[#858585]">
          Perform full application backup & restore across all physicsOS.* keys or execute targeted resets on individual feature domains.
        </p>

        {/* Primary One-Click Backup & Restore Buttons */}
        <div className="mt-4 flex flex-wrap gap-2.5 rounded-lg border border-[#0e639c]/30 bg-[#0e639c]/5 p-4">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 rounded-md border border-[#0e639c] bg-[#0e639c] px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#1177bb]"
          >
            <Download size={14} />
            Export Data Backup
          </button>

          <button
            type="button"
            onClick={() => backupInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3.5 py-2 text-xs font-medium text-[#e8e8e8] transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#383838]"
          >
            <Upload size={14} />
            Import Data Backup
          </button>

          <input
            ref={backupInputRef}
            type="file"
            accept="application/json"
            onChange={handleBackupFileSelect}
            className="hidden"
          />

          {desktopReady && (
            <>
              <button
                type="button"
                onClick={handleNativeExport}
                className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-2 text-xs font-medium text-[#cccccc] hover:border-[#4a4a4a]"
              >
                <Download size={13} />
                Native Desktop Export
              </button>
              <button
                type="button"
                onClick={handleNativeImport}
                className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-2 text-xs font-medium text-[#cccccc] hover:border-[#4a4a4a]"
              >
                <Upload size={13} />
                Native Desktop Import
              </button>
            </>
          )}
        </div>

        {/* FEATURE DATA MANAGEMENT / SCOPED RESETS */}
        <div className="mt-5 border-t border-[#3c3c3c] pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9d9d9d]">
            Feature Data Management / Scoped Resets
          </h4>
          <p className="mt-1 text-[11px] text-[#6e6e6e]">
            Reset individual data stores without clearing your whole setup. Each reset requires confirmation.
          </p>

          <div className="mt-3 grid gap-2.5">
            {/* 1. Active Study Timer */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#3c3c3c] bg-[#252526] text-[#858585]">
                  <Timer size={14} />
                </span>
                <div>
                  <p className="text-xs font-medium text-[#e8e8e8]">Active Study Timer</p>
                  <p className="text-[11px] text-[#858585]">
                    Current in-progress timer state and active study session draft. ({scopedCounts[SCOPES.ACTIVE_TIMER]?.label})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleScopedReset(
                    SCOPES.ACTIVE_TIMER,
                    'Reset Active Study Timer',
                    'Discard the active session timer and return to idle state?',
                  )
                }
                className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-xs text-[#cccccc] hover:border-[#5a1d1d] hover:bg-[#2b1d1d] hover:text-[#f3b4b4]"
              >
                <RotateCcw size={12} />
                Reset Timer
              </button>
            </div>

            {/* 2. Study History */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#3c3c3c] bg-[#252526] text-[#858585]">
                  <Clock size={14} />
                </span>
                <div>
                  <p className="text-xs font-medium text-[#e8e8e8]">Study History</p>
                  <p className="text-[11px] text-[#858585]">
                    Recorded study logs, session durations, and reflection entries. ({scopedCounts[SCOPES.STUDY_HISTORY]?.label})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleScopedReset(
                    SCOPES.STUDY_HISTORY,
                    'Clear Study History',
                    'Permanently delete all completed study session records and analytics logs?',
                  )
                }
                className="flex items-center gap-1.5 rounded-md border border-[#5a1d1d]/60 bg-[#2b1d1d]/50 px-2.5 py-1.5 text-xs text-[#f3b4b4] hover:bg-[#3c2525]"
              >
                <Trash2 size={12} />
                Clear History
              </button>
            </div>

            {/* 3. Notes & Bookmarks */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#3c3c3c] bg-[#252526] text-[#858585]">
                  <FileText size={14} />
                </span>
                <div>
                  <p className="text-xs font-medium text-[#e8e8e8]">Notes & Bookmarks</p>
                  <p className="text-[11px] text-[#858585]">
                    All user chapter notes, formula/memory bookmarks, and saved resources. ({scopedCounts[SCOPES.NOTES_AND_BOOKMARKS]?.label})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleScopedReset(
                    SCOPES.NOTES_AND_BOOKMARKS,
                    'Clear Notes & Bookmarks',
                    'Delete all written study notes and saved resource bookmarks across all subjects?',
                  )
                }
                className="flex items-center gap-1.5 rounded-md border border-[#5a1d1d]/60 bg-[#2b1d1d]/50 px-2.5 py-1.5 text-xs text-[#f3b4b4] hover:bg-[#3c2525]"
              >
                <Trash2 size={12} />
                Clear Notes & Bookmarks
              </button>
            </div>

            {/* 4. Mock Test Attempts */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#3c3c3c] bg-[#252526] text-[#858585]">
                  <BookOpen size={14} />
                </span>
                <div>
                  <p className="text-xs font-medium text-[#e8e8e8]">Mock Test Attempts</p>
                  <p className="text-[11px] text-[#858585]">
                    Mock test attempt scores, answered questions, and mock revision queue. ({scopedCounts[SCOPES.MOCK_TESTS]?.label})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleScopedReset(
                    SCOPES.MOCK_TESTS,
                    'Reset Mock Test Data',
                    'Clear all mock test attempt histories and queued mock items?',
                  )
                }
                className="flex items-center gap-1.5 rounded-md border border-[#5a1d1d]/60 bg-[#2b1d1d]/50 px-2.5 py-1.5 text-xs text-[#f3b4b4] hover:bg-[#3c2525]"
              >
                <RotateCcw size={12} />
                Reset Mock Data
              </button>
            </div>

            {/* 5. Error Learning Log */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#3c3c3c] bg-[#252526] text-[#858585]">
                  <AlertTriangle size={14} />
                </span>
                <div>
                  <p className="text-xs font-medium text-[#e8e8e8]">Error Learning Log</p>
                  <p className="text-[11px] text-[#858585]">
                    Logged error cards, mistake tags, difficulty ratings, and error revision queue. ({scopedCounts[SCOPES.ERROR_LOG]?.label})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleScopedReset(
                    SCOPES.ERROR_LOG,
                    'Reset Error Learning Log',
                    'Wipe all logged mistakes and error revision queue cards?',
                  )
                }
                className="flex items-center gap-1.5 rounded-md border border-[#5a1d1d]/60 bg-[#2b1d1d]/50 px-2.5 py-1.5 text-xs text-[#f3b4b4] hover:bg-[#3c2525]"
              >
                <RotateCcw size={12} />
                Reset Error Log
              </button>
            </div>
          </div>
        </div>

        {/* Legacy import hidden input */}
        <input
          ref={legacyImportInputRef}
          type="file"
          accept="application/json"
          onChange={handleLegacyImportFile}
          className="hidden"
        />
      </section>
    </div>
  )
}
