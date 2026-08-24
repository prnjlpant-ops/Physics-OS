import { useMemo, useState } from 'react'
import { getSubjects } from '../../engine/blueprintService'
import {
  getSyllabusTree,
  getAllTopics,
  searchTopics,
  getSyllabusProgress,
} from '../../data/syllabusData'
import { pruneTree, findNodeById } from '../../engine/syllabusEngine'
import { useSyllabusStatus } from '../../hooks/useSyllabusStatus'
import SyllabusSearchBar from '../../components/syllabus/SyllabusSearchBar'
import SyllabusFilterBar from '../../components/syllabus/SyllabusFilterBar'
import SyllabusProgressPanel from '../../components/syllabus/SyllabusProgressPanel'
import SyllabusExplorer from '../../components/syllabus/SyllabusExplorer'
import TopicDashboard from '../../components/syllabus/TopicDashboard'
import OfficialSyllabi from '../../components/syllabus/OfficialSyllabi'

function collectContainerIds(nodes, acc = new Set()) {
  nodes.forEach((node) => {
    if (node.level !== 'topic') {
      acc.add(node.id)
      collectContainerIds(node.children, acc)
    }
  })
  return acc
}

export default function SyllabusExplorerPage() {
  const [search, setSearch] = useState('')
  const [subjectId, setSubjectId] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [expandedIds, setExpandedIds] = useState(() => new Set())
  const [selectedTopicId, setSelectedTopicId] = useState(null)

  const { overrides, getStatus, setStatus: setTopicStatus } = useSyllabusStatus()

  const tree = getSyllabusTree()

  const filtersActive =
    search.trim() !== '' || subjectId !== 'all' || difficulty !== 'all' || status !== 'all' || priority !== 'all'

  const subjects = useMemo(() => getSubjects(), [])

  const filteredTopicIds = useMemo(() => {
    const baseTopics = search.trim() ? searchTopics(search) : getAllTopics()
    return new Set(
      baseTopics
        .filter((topic) => {
          if (subjectId !== 'all' && topic.metadata.subjectId !== subjectId) return false
          if (difficulty !== 'all' && topic.metadata.difficulty !== difficulty) return false
          if (priority !== 'all' && topic.metadata.priority !== priority) return false
          if (status !== 'all' && getStatus(topic) !== status) return false
          return true
        })
        .map((topic) => topic.id),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, subjectId, difficulty, priority, status, overrides])

  const prunedTree = useMemo(
    () => pruneTree(tree, (node) => node.level !== 'topic' || filteredTopicIds.has(node.id)),
    [tree, filteredTopicIds],
  )

  const effectiveExpandedIds = filtersActive ? collectContainerIds(prunedTree) : expandedIds

  const handleToggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const progress = useMemo(() => getSyllabusProgress(overrides), [overrides])

  const selectedTopic = selectedTopicId ? findNodeById(tree, selectedTopicId) : null

  return (
    <div className="flex flex-col gap-4">
      <SyllabusProgressPanel progress={progress} />
      <OfficialSyllabi />

      <div className="flex flex-col gap-3">
        <SyllabusSearchBar value={search} onChange={setSearch} />
        <SyllabusFilterBar
          subjects={subjects}
          subjectId={subjectId}
          onSubjectChange={setSubjectId}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <SyllabusExplorer
          tree={prunedTree}
          expandedIds={effectiveExpandedIds}
          onToggleExpand={handleToggleExpand}
          selectedTopicId={selectedTopicId}
          onSelectTopic={setSelectedTopicId}
          getTopicStatus={getStatus}
        />
        <TopicDashboard
          topic={selectedTopic}
          status={selectedTopic ? getStatus(selectedTopic) : null}
          onStatusChange={setTopicStatus}
        />
      </div>
    </div>
  )
}
