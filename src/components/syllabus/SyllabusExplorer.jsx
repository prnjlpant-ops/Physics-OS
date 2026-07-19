import { FolderTree } from 'lucide-react'
import SyllabusTreeNode from './SyllabusTreeNode'

export default function SyllabusExplorer({
  tree,
  expandedIds,
  onToggleExpand,
  selectedTopicId,
  onSelectTopic,
  getTopicStatus,
}) {
  if (tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#3c3c3c] bg-[#252526] px-4 py-12 text-center">
        <FolderTree size={20} strokeWidth={1.75} className="text-[#858585]" />
        <p className="text-xs text-[#858585]">No syllabus nodes match your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-2">
      {tree.map((node) => (
        <SyllabusTreeNode
          key={node.id}
          node={node}
          depth={0}
          expandedIds={expandedIds}
          onToggleExpand={onToggleExpand}
          selectedTopicId={selectedTopicId}
          onSelectTopic={onSelectTopic}
          getTopicStatus={getTopicStatus}
        />
      ))}
    </div>
  )
}
