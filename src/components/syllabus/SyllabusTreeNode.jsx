import { ChevronRight, ChevronDown, GraduationCap, BookOpen, Layers, FileStack, FileQuestion } from 'lucide-react'
import { TOPIC_STATUS_STYLES } from '../../constants/syllabusConstants'

const LEVEL_ICONS = {
  exam: GraduationCap,
  subject: BookOpen,
  unit: Layers,
  chapter: FileStack,
  topic: FileQuestion,
}

const LEVEL_INDENT = {
  exam: 'pl-1',
  subject: 'pl-5',
  unit: 'pl-9',
  chapter: 'pl-[52px]',
  topic: 'pl-16',
}

export default function SyllabusTreeNode({
  node,
  depth,
  expandedIds,
  onToggleExpand,
  selectedTopicId,
  onSelectTopic,
  getTopicStatus,
}) {
  const isLeaf = node.level === 'topic'
  const isExpanded = expandedIds.has(node.id)
  const Icon = LEVEL_ICONS[node.level] ?? FileQuestion

  const handleClick = () => {
    if (isLeaf) {
      onSelectTopic(node.id)
    } else {
      onToggleExpand(node.id)
    }
  }

  const isSelected = isLeaf && node.id === selectedTopicId
  const status = isLeaf ? getTopicStatus(node) : null

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={[
          'flex w-full items-center gap-1.5 rounded py-1 pr-2 text-left text-xs transition-colors duration-150',
          LEVEL_INDENT[node.level] ?? 'pl-1',
          isSelected ? 'bg-[#0e639c]/20 text-[#4fc1ff]' : 'text-[#cccccc] hover:bg-[#2d2d2d]',
        ].join(' ')}
      >
        {!isLeaf ? (
          isExpanded ? (
            <ChevronDown size={13} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
          ) : (
            <ChevronRight size={13} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
          )
        ) : (
          <span className="w-[13px] shrink-0" />
        )}
        <Icon size={13} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
        <span className="truncate">{node.name}</span>
        {isLeaf && status && (
          <span
            className={`ml-auto shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] ${TOPIC_STATUS_STYLES[status]}`}
          >
            {status}
          </span>
        )}
      </button>

      {!isLeaf && isExpanded && node.children?.length > 0 && (
        <div>
          {node.children.map((child) => (
            <SyllabusTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              selectedTopicId={selectedTopicId}
              onSelectTopic={onSelectTopic}
              getTopicStatus={getTopicStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}
