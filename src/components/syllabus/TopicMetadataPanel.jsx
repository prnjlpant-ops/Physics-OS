import { Clock3, Brain as BrainIcon, Gauge, Flag, History } from 'lucide-react'
import SyllabusBadge from './SyllabusBadge'
import {
  DIFFICULTY_STYLES,
  IMPORTANCE_STYLES,
  PRIORITY_STYLES,
  REVISION_STATUS_STYLES,
} from '../../constants/syllabusConstants'

function MetaRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2">
      <span className="flex items-center gap-2 text-xs text-[#858585]">
        <Icon size={14} strokeWidth={1.75} />
        {label}
      </span>
      {children}
    </div>
  )
}

export default function TopicMetadataPanel({ metadata }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <MetaRow icon={Clock3} label="Estimated Study Time">
        <span className="text-xs font-medium text-[#e8e8e8]">{metadata.estimatedStudyTime}</span>
      </MetaRow>
      <MetaRow icon={Clock3} label="Estimated Problem Solving Time">
        <span className="text-xs font-medium text-[#e8e8e8]">
          {metadata.estimatedProblemSolvingTime}
        </span>
      </MetaRow>
      <MetaRow icon={Gauge} label="Difficulty">
        <SyllabusBadge label={metadata.difficulty} styleClass={DIFFICULTY_STYLES[metadata.difficulty]} />
      </MetaRow>
      <MetaRow icon={BrainIcon} label="Importance">
        <SyllabusBadge label={metadata.importance} styleClass={IMPORTANCE_STYLES[metadata.importance]} />
      </MetaRow>
      <MetaRow icon={Flag} label="Priority">
        <SyllabusBadge label={metadata.priority} styleClass={PRIORITY_STYLES[metadata.priority]} />
      </MetaRow>
      <MetaRow icon={History} label="Revision Status">
        <SyllabusBadge
          label={metadata.revisionStatus}
          styleClass={REVISION_STATUS_STYLES[metadata.revisionStatus]}
        />
      </MetaRow>
    </div>
  )
}
