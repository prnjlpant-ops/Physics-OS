import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Upload, FileJson, RotateCcw, Database } from 'lucide-react'
import { useMasterIndex } from '../context/MasterIndexProvider'
import { KNOWLEDGE_BASE_CATEGORY_ORDER } from '../constants/knowledgeBaseConstants'
import { RESOURCE_STATUS } from '../constants/masterIndexConstants'
import exampleMasterIndex from '../data/knowledgeBase/knowledge_base.example.json'

function downloadJson(filename, jsonString) {
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function computeStats(masterIndex) {
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

  return { subjectCount: subjectEntries.length, total, notAdded, added: total - notAdded }
}

export default function MasterIndexPage() {
  const { masterIndex, exportToJson, importFromJson, resetToDefault } = useMasterIndex()
  const fileInputRef = useRef(null)
  const [importResult, setImportResult] = useState(null)

  const stats = computeStats(masterIndex)

  const handleExport = () => {
    downloadJson('knowledge_base.json', exportToJson())
  }

  const handleDownloadTemplate = () => {
    downloadJson('knowledge_base.example.json', JSON.stringify(exampleMasterIndex, null, 2))
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = importFromJson(String(reader.result ?? ''))
      setImportResult(result)
    }
    reader.onerror = () => {
      setImportResult({ success: false, error: 'Could not read that file.', warnings: [] })
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset the Master Index to defaults? This replaces every resource record currently stored.',
    )
    if (!confirmed) return
    resetToDefault()
    setImportResult(null)
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          Settings
        </Link>

        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc]">
            <Database size={22} strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#e8e8e8]">Master Index</h2>
            <p className="text-xs text-[#858585]">
              The single source of truth every resource card is built from.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Subjects', value: stats.subjectCount },
          { label: 'Total Resources', value: stats.total },
          { label: 'Path Added', value: stats.added },
          { label: 'Not Added', value: stats.notAdded },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5"
          >
            <p className="text-xs text-[#858585]">{stat.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-[#e8e8e8]">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="flex items-center gap-2">
          <Download size={15} strokeWidth={1.75} className="text-[#858585]" />
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Export Master Index</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
          Downloads the current Master Index — every subject, category and resource — as a
          single JSON file you can back up or edit by hand.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="mt-3 flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <Download size={13} strokeWidth={1.75} />
          Export knowledge_base.json
        </button>
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="flex items-center gap-2">
          <Upload size={15} strokeWidth={1.75} className="text-[#858585]" />
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Import Master Index</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
          Loads a JSON file in the same structure and replaces the Master Index currently
          stored. Malformed or partially-filled-in files are accepted — missing fields fall
          back to safe defaults and a resource with no path always shows as{' '}
          <span className="text-[#9d9d9d]">Not Added</span> instead of erroring.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <Upload size={13} strokeWidth={1.75} />
            Choose JSON File
          </button>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
          >
            <FileJson size={13} strokeWidth={1.75} />
            Download Example Template
          </button>
        </div>

        {importResult && (
          <div
            className={[
              'mt-3 rounded-md border p-3 text-[11px] leading-relaxed',
              importResult.success
                ? 'border-[#3c5a3c] bg-[#1e2b1e] text-[#8fbc8f]'
                : 'border-[#5a3c3c] bg-[#2b1e1e] text-[#d98f8f]',
            ].join(' ')}
          >
            {importResult.success ? 'Master Index imported successfully.' : importResult.error}
            {importResult.warnings?.length > 0 && (
              <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-[#d2b48c]">
                {importResult.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw size={15} strokeWidth={1.75} className="text-[#858585]" />
            <h3 className="text-sm font-semibold text-[#e8e8e8]">Reset to Defaults</h3>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            Reset
          </button>
        </div>
        <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
          Replaces every resource with one blank, Not Added placeholder per category, for every
          subject in the syllabus.
        </p>
      </section>
    </div>
  )
}
