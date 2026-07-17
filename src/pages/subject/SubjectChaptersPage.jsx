import { useOutletContext } from 'react-router-dom'
import ChapterCard from './ChapterCard'

export default function SubjectChaptersPage() {
  const { subject } = useOutletContext()

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {subject.chapters.map((chapter) => (
        <ChapterCard key={chapter.slug} subjectId={subject.id} chapter={chapter} />
      ))}
    </div>
  )
}
