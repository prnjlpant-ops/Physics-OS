import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { PLANNER_SETTINGS_FIELDS } from '../../constants/plannerConstants'

export default function PlannerSettingsPanel({ settings, onChange, onReset }) {
  return (
    <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} strokeWidth={1.75} className="text-[#858585]" />
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Planner Settings</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-xs text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
        >
          <RotateCcw size={12} strokeWidth={1.75} />
          Reset Defaults
        </button>
      </div>
      <p className="mt-0.5 text-[11px] text-[#6e6e6e]">
        UI only — these preferences are saved but don&apos;t change today&apos;s plan yet.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PLANNER_SETTINGS_FIELDS.map((field) => (
          <label key={field.key} className="flex flex-col gap-1.5">
            <span className="text-[11px] text-[#9d9d9d]">{field.label}</span>
            <div className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1.5">
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                value={settings[field.key]}
                onChange={(event) => onChange(field.key, Number(event.target.value))}
                className="w-full bg-transparent text-sm text-[#e8e8e8] outline-none"
              />
              <span className="shrink-0 text-[10px] text-[#6e6e6e]">{field.unit}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
