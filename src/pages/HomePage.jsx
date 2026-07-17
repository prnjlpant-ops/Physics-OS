import GreetingCard from './home/GreetingCard'
import ContinueStudyingCard from './home/ContinueStudyingCard'
import TodaysMissionSection from './home/TodaysMissionSection'
import StudyTimerPreview from './home/StudyTimerPreview'
import QuickAccess from './home/QuickAccess'
import ProgressSnapshot from './home/ProgressSnapshot'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <GreetingCard />
      <ContinueStudyingCard />

      <div className="grid gap-5 lg:grid-cols-2">
        <TodaysMissionSection />
        <StudyTimerPreview />
      </div>

      <QuickAccess />
      <ProgressSnapshot />
    </div>
  )
}
