import { KNOWLEDGE_BASE_CATEGORY_META } from '../../constants/knowledgeBaseConstants'
import KnowledgeBaseCard from './KnowledgeBaseCard'

export default function KnowledgeBaseCategorySection({ categoryKey, resources }) {
  const meta = KNOWLEDGE_BASE_CATEGORY_META[categoryKey]
  const Icon = meta.icon

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Icon size={14} strokeWidth={1.75} className="text-[#858585]" />
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[#9d9d9d]">
          {meta.label}
        </h4>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <KnowledgeBaseCard key={resource.id} resource={resource} icon={Icon} />
        ))}
      </div>
    </section>
  )
}
