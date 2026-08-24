import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTopicIndex } from '../../hooks/useTopicIndex'
import { STUDY_MAPPING_CATEGORY_ORDER } from '../../constants/topicConstants'
import TopicStatusBadge from '../../components/topics/TopicStatusBadge'
import TopicBreadcrumb from '../../components/topics/TopicBreadcrumb'
import TopicProgressControl from '../../components/topics/TopicProgressControl'
import StudyMappingSection from '../../components/topics/StudyMappingSection'
import PyqMappingSection from '../../components/topics/PyqMappingSection'
import TopicQuestionBankSection from '../../components/topics/TopicQuestionBankSection'
import { hasAnyResolvedResources } from '../../engine/topics/studyMappingService'

/**
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * A reusable details page for any topic in the Topic Index — not tied to
 * one subject or chapter, so every topic across the whole Knowledge Base
 * routes here. Mirrors the shape of `pages/library/ResourceDetailsPage.jsx`
 * and `pages/PyqPaperDetailsPage.jsx`: graceful fallback for an unknown id,
 * a details card, then a progress control.
 */
export default function TopicDetailsPage() {
  const { topicId } = useParams()
  const { getTopicById, getBreadcrumbForTopic, getStudyMap, setStatus } = useTopicIndex()

  const topic = getTopicById(topicId)

  if (!topic) {
    return (
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/topics" className="inline-flex items-center gap-1.5 text-xs text-[#858585] hover:text-[#cccccc]">
          <ArrowLeft size={14} strokeWidth={1.75} />
          Topic Index
        </Link>
        <p className="text-sm text-[#9d9d9d]">That topic couldn&apos;t be found in the Topic Index.</p>
      </div>
    )
  }

  const breadcrumb = getBreadcrumbForTopic(topic)
  const studyMap = getStudyMap(topic)
  const hasResources = hasAnyResolvedResources(studyMap)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <Link
        to="/topics"
        className="inline-flex w-fit items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
      >
        <ArrowLeft size={14} strokeWidth={1.75} />
        Topic Index
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <TopicBreadcrumb subjectName={breadcrumb.subjectName} chapterName={breadcrumb.chapterName} />
          <h2 className="mt-1 text-lg font-semibold text-[#e8e8e8]">{topic.name}</h2>
        </div>
        <TopicStatusBadge status={topic.status} />
      </div>

      {topic.description && (
        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Description</p>
          <p className="mt-1 text-sm leading-relaxed text-[#cccccc]">{topic.description}</p>
        </div>
      )}

      <TopicProgressControl status={topic.status} onChange={(status) => setStatus(topic.id, status)} />

      <div className="flex flex-col gap-4 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Study Mapping</h3>
        {!hasResources && studyMap && !STUDY_MAPPING_CATEGORY_ORDER.some((key) => studyMap[key].broken.length) ? (
          <p className="text-[11px] leading-relaxed text-[#6e6e6e]">
            No resources mapped to this topic yet. Add ids to this topic&apos;s related* arrays in pyq_index.json to
            connect Books, Formula Sheets, Memory Sheets, Notes, Videos, and Research Papers here.
          </p>
        ) : (
          STUDY_MAPPING_CATEGORY_ORDER.map((categoryKey) => (
            <StudyMappingSection key={categoryKey} categoryKey={categoryKey} entry={studyMap[categoryKey]} />
          ))
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">PYQs</h3>
        {studyMap.pyqs.resolved.length === 0 && studyMap.pyqs.broken.length === 0 ? (
          <p className="text-[11px] leading-relaxed text-[#6e6e6e]">
            No previous year papers mapped to this topic yet.
          </p>
        ) : (
          <PyqMappingSection entry={studyMap.pyqs} />
        )}
      </div>

      <TopicQuestionBankSection topic={{ ...topic, subjectName: breadcrumb.subjectName, chapterName: breadcrumb.chapterName }} />
    </div>
  )
}
