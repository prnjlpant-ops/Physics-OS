import { useOutletContext, Link } from 'react-router-dom'
import { FolderTree, Settings2, Database } from 'lucide-react'
import { KNOWLEDGE_BASE_CATEGORY_ORDER } from '../../constants/knowledgeBaseConstants'
import { useKnowledgeBaseSettings } from '../../hooks/useKnowledgeBaseSettings'
import { useMasterIndex } from '../../context/MasterIndexProvider'
import { isRootPathConfigured } from '../../engine/knowledgeBaseService'
import KnowledgeBaseCategorySection from '../../components/knowledgeBase/KnowledgeBaseCategorySection'

/**
 * Sprint 22 — every resource card below now comes from the Master Index
 * (context/MasterIndexProvider.jsx) instead of being generated on the fly.
 * The Knowledge Base Root Path (Settings) is kept purely as a display
 * convenience — an example of where a subject's folder would live — since
 * each resource's own `localPath` is what actually drives its status.
 */
export default function SubjectKnowledgeBasePage() {
  const { subject } = useOutletContext()
  const { rootPath } = useKnowledgeBaseSettings()
  const { getSubjectResources } = useMasterIndex()

  const categories = getSubjectResources(subject.id)
  const isRootConfigured = isRootPathConfigured(rootPath)

  return (
    <div className="flex flex-col gap-5">
      <section className="flex items-center gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
          <FolderTree size={17} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Knowledge Base</h3>
          <p className="mt-0.5 truncate text-xs text-[#858585]">
            {isRootConfigured ? `${rootPath}\\${subject.name}` : 'No root path configured yet'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {!isRootConfigured && (
            <Link
              to="/settings"
              className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
            >
              <Settings2 size={13} strokeWidth={1.75} />
              Configure in Settings
            </Link>
          )}
          <Link
            to="/settings/master-index"
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
          >
            <Database size={13} strokeWidth={1.75} />
            Master Index
          </Link>
        </div>
      </section>

      <div className="flex flex-col gap-5">
        {KNOWLEDGE_BASE_CATEGORY_ORDER.map((categoryKey) => (
          <KnowledgeBaseCategorySection
            key={categoryKey}
            categoryKey={categoryKey}
            resources={categories[categoryKey] ?? []}
          />
        ))}
      </div>
    </div>
  )
}
