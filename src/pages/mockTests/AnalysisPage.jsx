import { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Percent, Clock3, Target } from 'lucide-react'
import { generateAnalysisData, getQuickStatistics } from '../../data/mockTestsData'
import AnalysisTabs from '../../components/mockTests/AnalysisTabs'
import BarRow from '../../components/mockTests/BarRow'
import StatCard from '../../components/mockTests/StatCard'

function OverallTab({ stats, data }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Target} label="Average Score" value={`${stats.averageScore}%`} accent />
        <StatCard icon={Percent} label="Accuracy" value={`${stats.accuracy}%`} />
        <StatCard icon={Clock3} label="Hours Practiced" value={stats.hoursPracticed} />
        <StatCard icon={TrendingUp} label="Tests Analyzed" value={stats.totalTests} />
      </div>
      <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Accuracy by Subject</h4>
        <div className="flex flex-col gap-3">
          {data.subjectWise.map((subject) => (
            <BarRow key={subject.id} label={subject.name} value={subject.accuracy} />
          ))}
        </div>
      </div>
    </div>
  )
}

function SubjectWiseTab({ data }) {
  return (
    <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Subject-wise Accuracy</h4>
      <div className="flex flex-col gap-3">
        {data.subjectWise.map((subject) => (
          <BarRow
            key={subject.id}
            label={subject.name}
            sublabel={`${subject.attempted} attempted`}
            value={subject.accuracy}
          />
        ))}
      </div>
    </div>
  )
}

function ChapterWiseTab({ data }) {
  return (
    <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Chapter-wise Accuracy</h4>
      <div className="flex flex-col gap-3">
        {data.chapterWise.map((chapter) => (
          <BarRow
            key={chapter.id}
            label={`${chapter.name}`}
            sublabel={chapter.subjectName}
            value={chapter.accuracy}
            tone={chapter.accuracy < 50 ? 'bad' : chapter.accuracy < 70 ? 'warn' : 'good'}
          />
        ))}
      </div>
    </div>
  )
}

function DifficultyWiseTab({ data }) {
  return (
    <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Accuracy by Difficulty</h4>
      <div className="flex flex-col gap-3">
        {data.difficultyWise.map((level) => (
          <BarRow
            key={level.level}
            label={level.level}
            sublabel={`${level.attempted} attempted`}
            value={level.accuracy}
            tone={level.level === 'Easy' ? 'good' : level.level === 'Moderate' ? 'warn' : 'bad'}
          />
        ))}
      </div>
    </div>
  )
}

function TimeAnalysisTab({ data }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Time Share by Subject</h4>
        <div className="flex flex-col gap-3">
          {data.timeAnalysis.map((subject) => (
            <BarRow key={subject.id} label={subject.name} value={subject.timeShare} max={25} suffix="%" />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Avg. Time per Question</h4>
        <div className="flex flex-col gap-3">
          {data.timeAnalysis.map((subject) => (
            <BarRow
              key={subject.id}
              label={subject.name}
              value={subject.avgTimePerQuestion}
              max={150}
              suffix="s"
              tone="accent"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function WeakStrongTab({ data }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-lg border border-[#f48771]/30 bg-[#252526] p-4">
        <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#f48771]">
          <TrendingDown size={15} strokeWidth={1.75} />
          Weak Areas
        </h4>
        <div className="flex flex-col gap-3">
          {data.weakAreas.map((subject) => (
            <BarRow key={subject.id} label={subject.name} value={subject.accuracy} tone="bad" />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-[#89d185]/30 bg-[#252526] p-4">
        <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#89d185]">
          <TrendingUp size={15} strokeWidth={1.75} />
          Strong Areas
        </h4>
        <div className="flex flex-col gap-3">
          {data.strongAreas.map((subject) => (
            <BarRow key={subject.id} label={subject.name} value={subject.accuracy} tone="good" />
          ))}
        </div>
      </div>
    </div>
  )
}

function MistakeDistributionTab({ data }) {
  return (
    <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Mistake Distribution</h4>
      <div className="flex flex-col gap-3">
        {data.mistakeDistribution.map((mistake) => (
          <BarRow key={mistake.label} label={mistake.label} value={mistake.share} tone="warn" />
        ))}
      </div>
    </div>
  )
}

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState('overall')
  const data = useMemo(() => generateAnalysisData(), [])
  const stats = useMemo(() => getQuickStatistics(), [])

  return (
    <div className="flex flex-col gap-4">
      <AnalysisTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overall' && <OverallTab stats={stats} data={data} />}
      {activeTab === 'subjectWise' && <SubjectWiseTab data={data} />}
      {activeTab === 'chapterWise' && <ChapterWiseTab data={data} />}
      {activeTab === 'difficultyWise' && <DifficultyWiseTab data={data} />}
      {activeTab === 'timeAnalysis' && <TimeAnalysisTab data={data} />}
      {activeTab === 'weakStrong' && <WeakStrongTab data={data} />}
      {activeTab === 'mistakes' && <MistakeDistributionTab data={data} />}
    </div>
  )
}
