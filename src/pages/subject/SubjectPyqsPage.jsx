import { useOutletContext } from 'react-router-dom'
import { getAllPyqs } from '../../data/pyqsData'
import { getChapterPyqStats } from '../../data/pyqProgress'
import { usePyqStatus } from '../../hooks/usePyqStatus'
import ChapterPyqsCard from '../../components/pyqs/ChapterPyqsCard'

export default function SubjectPyqsPage() {
  const { subject } = useOutletContext()
  const { getStatus } = usePyqStatus()
  const allPyqs = getAllPyqs()

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {subject.chapters.map((chapter) => {
        const { totalQuestions, solved } = getChapterPyqStats(allPyqs, subject.id, chapter.slug, getStatus)
        return (
          <ChapterPyqsCard
            key={chapter.slug}
            subjectId={subject.id}
            chapter={chapter}
            totalQuestions={totalQuestions}
            solved={solved}
          />
        )
      })}
    </div>
  )
}
