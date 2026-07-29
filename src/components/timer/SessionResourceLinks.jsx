import { Library } from 'lucide-react'
import { useStudyTimer } from '../../context/StudyTimerContext'
import { topicRecords } from '../../engine/topics'
import { getTopicById } from '../../engine/topics/topicIndexService'
import { buildStudyMap, hasAnyResolvedResources } from '../../engine/topics/studyMappingService'
import { libraryMasterIndex } from '../../engine/library'
import { pyqLibraryIndex } from '../../engine/pyq'
import { STUDY_MAPPING_CATEGORY_ORDER } from '../../constants/topicConstants'
import StudyMappingSection from '../topics/StudyMappingSection'
import PyqMappingSection from '../topics/PyqMappingSection'

/**
 * SESSION RESOURCE LINKS
 * =======================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * "If a study session is linked to a topic, automatically display Books /
 * Notes / Formula Sheets / Memory Sheets / Videos / Research Papers / PYQs
 * using the existing metadata." Reuses Sprint 26's
 * `StudyMappingService.buildStudyMap` + the exact
 * `StudyMappingSection`/`PyqMappingSection` components the Topic Details
 * page already renders — no new resource lookup logic, no hardcoded
 * resources. Clicking a resolved resource logs it into the session's
 * `resourcesOpened` (Session Model field) via `logResourceOpened`.
 */
export default function SessionResourceLinks() {
  const { topicId, logResourceOpened } = useStudyTimer()
  if (!topicId) return null

  const topic = getTopicById({ topics: topicRecords }, topicId)
  if (!topic) return null

  const studyMap = buildStudyMap(topic, libraryMasterIndex, pyqLibraryIndex)
  if (!hasAnyResolvedResources(studyMap)) return null

  const handleClickCapture = (event) => {
    const link = event.target.closest('a[href^="/library/resource/"], a[href^="/pyqs/"]')
    if (link) logResourceOpened({ id: link.getAttribute('href').split('/').pop(), title: link.textContent })
  }

  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
        <Library size={14} strokeWidth={1.75} />
        Linked Resources
      </h2>
      <div className="mt-3 flex flex-col gap-3" onClickCapture={handleClickCapture}>
        {STUDY_MAPPING_CATEGORY_ORDER.map((categoryKey) => (
          <StudyMappingSection key={categoryKey} categoryKey={categoryKey} entry={studyMap[categoryKey]} />
        ))}
        <PyqMappingSection entry={studyMap.pyqs} />
      </div>
    </section>
  )
}
