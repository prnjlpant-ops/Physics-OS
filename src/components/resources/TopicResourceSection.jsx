import { RESOURCE_TYPE_ORDER, RESOURCE_TYPE_META } from '../../constants/resourceTypes'
import TopicResourceCard from './TopicResourceCard'

/**
 * TopicResourceSection — Sprint 18A.
 * ===================================
 * Renders every Topic's mapped resource bundle (from
 * `engine/resourceMappingService.js` -> `getTopicResources`) as one labeled
 * section per type — Books, Videos, PDFs, Solution Manuals, Reference
 * Material, External Links — each a small grid of `TopicResourceCard`s.
 * Types with no resources for this topic are skipped rather than shown
 * empty.
 */
export default function TopicResourceSection({ resources }) {
  const typesWithContent = RESOURCE_TYPE_ORDER.filter((type) => resources[type]?.length)

  if (typesWithContent.length === 0) {
    return <p className="text-xs text-[#6e6e6e]">No resources mapped to this topic yet.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {typesWithContent.map((type) => (
        <div key={type} className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            {RESOURCE_TYPE_META[type].label}
            <span className="ml-1.5 text-[#4a4a4a]">{resources[type].length}</span>
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {resources[type].map((resource) => (
              <TopicResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
