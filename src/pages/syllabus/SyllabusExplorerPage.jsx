import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getScopeBadgeLabel, getSubjects } from '../../data/subjects.js'
import {
  getSyllabusTree,
  getAllTopics,
  searchTopics,
  getSyllabusProgress,
} from '../../data/syllabusData'
import { pruneTree, findNodeById } from '../../engine/syllabusEngine'
import { useSyllabusStatus } from '../../hooks/useSyllabusStatus'
import { useTopicProgress } from '../../hooks/useTopicProgress'
import { getRoadmapMissionSnapshot } from '../../engine/roadmapMissionService'
import SyllabusSearchBar from '../../components/syllabus/SyllabusSearchBar'
import SyllabusFilterBar from '../../components/syllabus/SyllabusFilterBar'
import SyllabusProgressPanel from '../../components/syllabus/SyllabusProgressPanel'
import SyllabusExplorer from '../../components/syllabus/SyllabusExplorer'
import TopicDashboard from '../../components/syllabus/TopicDashboard'
import OfficialSyllabi from '../../components/syllabus/OfficialSyllabi'
import booksData from '../../data/library/books.json'

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
  const { statuses: roadmapStatuses } = useTopicProgress()
  const roadmapSnapshot = useMemo(() => getRoadmapMissionSnapshot(roadmapStatuses, new Date()), [roadmapStatuses])

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
  const missingBooks = booksData.books.filter((book) => book.available === false)
  const executiveRows = useMemo(
    () =>
      subjects.map((subject) => {
        const chapterCount = subject.chapters?.length ?? 0
        const topicCount = (subject.chapters ?? []).reduce(
          (sum, chapter) => sum + (chapter.topics?.length ?? 0),
          0,
        )
        return {
          id: subject.id,
          name: subject.name,
          chapterCount,
          topicCount,
          weightage: subject.weightageRange || '—',
          tier: getScopeBadgeLabel(subject.examScope ?? 'JAM_JEST'),
          videos: 0,
          pyqsComplete: '—',
        }
      }),
    [subjects],
  )

  return (
    <div className="flex flex-col gap-4">
      <SyllabusProgressPanel progress={progress} />
      <section className="rounded-lg border border-[#0e639c]/40 bg-[#0e639c]/10 p-4">
        <p className="text-[10px] uppercase tracking-wide text-[#4fc1ff]">v6.1 syllabus sync</p>
        <p className="mt-1 text-sm font-medium text-[#e8e8e8]">Chapter resources, lecture links, and PYQ cues are now wired directly into the chapter flow instead of sitting in a separate disconnected sheet.</p>
        <p className="mt-1 text-xs text-[#9d9d9d]">Current roadmap focus: {roadmapSnapshot.nextTopic?.title ?? 'Roadmap is fully covered.'} · Checkpoint: {roadmapSnapshot.checkpoint.label}</p>
      </section>

      <section className="rounded-xl border border-[#3c3c3c] bg-[#1b1d22] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#7dd3fc]">Executive matrix</p>
            <p className="mt-1 text-sm text-[#e8e8e8]">Bird’s-eye view for the active subject cockpit</p>
          </div>
          <span className="text-[10px] text-[#94a3b8]">{executiveRows.length} units</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left text-xs">
            <thead>
              <tr className="text-[#9d9d9d]">
                <th className="px-2 py-1 font-medium">Unit Name</th>
                <th className="px-2 py-1 font-medium">Weightage %</th>
                <th className="px-2 py-1 font-medium">Active Tier</th>
                <th className="px-2 py-1 font-medium">Videos</th>
                <th className="px-2 py-1 font-medium">PYQs</th>
                <th className="px-2 py-1 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {executiveRows.map((row) => (
                <tr key={row.id} className="rounded-md border border-[#2f2f2f] bg-[#121620] text-[#d6d6d6]">
                  <td className="rounded-l-md px-2 py-2.5">
                    <div className="font-medium text-[#e8e8e8]">{row.name}</div>
                    <div className="mt-0.5 text-[10px] text-[#858585]">{row.chapterCount} chapters · {row.topicCount} topics</div>
                  </td>
                  <td className="px-2 py-2.5 text-[#cccccc]">{row.weightage}</td>
                  <td className="px-2 py-2.5">
                    <span className="rounded-full border border-[#4fc1ff]/30 bg-[#4fc1ff]/10 px-2 py-0.5 text-[10px] text-[#a5d7ff]">{row.tier}</span>
                  </td>
                  <td className="px-2 py-2.5 text-[#cccccc]">0/{row.topicCount}</td>
                  <td className="px-2 py-2.5 text-[#cccccc]">{row.pyqsComplete}</td>
                  <td className="rounded-r-md px-2 py-2.5">
                    <Link to={`/subjects/${row.id}`} className="inline-flex items-center gap-1 rounded-md border border-[#0e639c] bg-[#0e639c]/10 px-2.5 py-1.5 text-[10px] font-medium text-[#bfe6ff] hover:bg-[#0e639c]/20">
                      Open Subject Cockpit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <OfficialSyllabi />
      {missingBooks.length > 0 && (
        <section className="rounded-lg border border-[#e2c08d]/40 bg-[#e2c08d]/10 p-4">
          <p className="text-[10px] uppercase tracking-wide text-[#e2c08d]">Books to add</p>
          <p className="mt-1 text-xs text-[#d2b48c]">These syllabus books are referenced, but their local files have not been added yet.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {missingBooks.map((book) => <div key={book.id} className="rounded-md border border-[#e2c08d]/30 bg-[#1e1e1e] px-3 py-2"><p className="text-xs font-medium text-[#e8e8e8]">{book.title}</p><p className="mt-0.5 text-[10px] text-[#858585]">Add at: {book.path}</p></div>)}
          </div>
        </section>
      )}

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
