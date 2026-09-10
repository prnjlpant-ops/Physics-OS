import { ChevronRight, ListChecks, FolderTree, Library, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getQuestionsForTopic, getRoadmapChapterIdForTopic } from '../../engine/pyq/questionBankService'
import TopicStatusSelect from './TopicStatusSelect'
import TopicMetadataPanel from './TopicMetadataPanel'
import LinkedModulesPanel from './LinkedModulesPanel'
import TopicResourceSection from '../resources/TopicResourceSection'
import { getTopicResources } from '../../engine/resourceMappingService'
import { useStudySessions } from '../../hooks/useStudySessions'

export default function TopicDashboard({ topic, status, onStatusChange }) {
  const sessions = useStudySessions()
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
  const quizQuestions = getQuestionsForTopic(topic, 3)
  const roadmapChapterId = getRoadmapChapterIdForTopic(topic)
  const quizPath = roadmapChapterId ? `/pyqs/practice?chapter=${encodeURIComponent(roadmapChapterId)}` : '/pyqs/practice'
  const topicSessions = sessions.filter((session) => session.topicId === topic.id)

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
        <h3 className="mt-1 text-base font-semibold text-[#e8e8e8]">
          {topic.metadata?.fullTitle || (topic.metadata?.chapterName ? `${topic.metadata.chapterName}: ${topic.name}` : topic.name)}
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Topic Status</p>
        <TopicStatusSelect status={status} onChange={(next) => onStatusChange(topic.id, next)} />
      </div>

      {topicSessions.length > 0 && <section className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2"><p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Saved study sessions</p><p className="mt-1 text-xs text-[#cccccc]">{topicSessions.length} session{topicSessions.length === 1 ? '' : 's'} linked to this topic.</p></section>}

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

      <section className="flex flex-col gap-2 border-t border-[#3c3c3c] pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#6e6e6e]"><FlaskConical size={12} /> Topic PYQ quiz</p>
          <Link to={quizPath} className="text-xs text-[#4fc1ff] hover:text-[#9cdcfe]">Open quiz</Link>
        </div>
        {quizQuestions.length ? <div className="flex flex-col gap-1.5">{quizQuestions.map((question) => <Link key={question.id} to={`/pyqs/practice/${question.id}`} className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-xs text-[#cccccc] hover:border-[#4a4a4a]">{question.exam} {question.year} · Q{question.questionNumber} · {question.subtopic}</Link>)}</div> : <p className="text-xs text-[#858585]">No verified PYQ mapping is available for this topic yet.</p>}
      </section>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Linked Modules</p>
        <LinkedModulesPanel linkedModules={{ ...topic.metadata.linkedModules, pyqs: quizPath }} />
      </div>
    </div>
  )
}
