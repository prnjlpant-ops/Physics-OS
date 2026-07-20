import { ChevronRight, ListChecks, FolderTree, Library } from 'lucide-react'
import TopicStatusSelect from './TopicStatusSelect'
import TopicMetadataPanel from './TopicMetadataPanel'
import LinkedModulesPanel from './LinkedModulesPanel'
import TopicResourceSection from '../resources/TopicResourceSection'
import { getTopicResources } from '../../engine/resourceMappingService'

export default function TopicDashboard({ topic, status, onStatusChange }) {
  if (!topic) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#3c3c3c] bg-[#252526] px-6 py-16 text-center">
        <FolderTree size={22} strokeWidth={1.75} className="text-[#858585]" />
        <p className="text-sm text-[#858585]">Select a topic from the explorer to see its dashboard.</p>
      </div>
    )
  }

  const breadcrumb = [...topic.ancestors, topic].map((node) => node.name)
  const topicResources = getTopicResources(topic)

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <div>
        <div className="flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-wide text-[#6e6e6e]">
          {breadcrumb.map((crumb, index) => (
            <span key={crumb} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={10} strokeWidth={1.75} />}
              {crumb}
            </span>
          ))}
        </div>
        <h3 className="mt-1 text-base font-semibold text-[#e8e8e8]">{topic.name}</h3>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Topic Status</p>
        <TopicStatusSelect status={status} onChange={(next) => onStatusChange(topic.id, next)} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Metadata</p>
        <TopicMetadataPanel metadata={topic.metadata} />
      </div>

      {topic.children?.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            <ListChecks size={12} strokeWidth={1.75} />
            Subtopics
          </p>
          <ul className="flex flex-col gap-1.5">
            {topic.children.map((subtopic) => (
              <li
                key={subtopic.id}
                className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-xs text-[#cccccc]"
              >
                <p className="font-medium text-[#e8e8e8]">{subtopic.name}</p>
                <p className="mt-0.5 text-[#858585]">{subtopic.metadata.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#6e6e6e]">
          <Library size={12} strokeWidth={1.75} />
          Resources
        </p>
        <TopicResourceSection resources={topicResources} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Linked Modules</p>
        <LinkedModulesPanel linkedModules={topic.metadata.linkedModules} />
      </div>
    </div>
  )
}
