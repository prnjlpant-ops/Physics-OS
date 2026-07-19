import { useMockSettings } from '../../hooks/useMockSettings'
import {
  EXAMS,
  DEFAULT_DURATION_OPTIONS,
  DIFFICULTY_LEVELS,
  PALETTE_STYLE_OPTIONS,
} from '../../constants/mockTestConstants'
import SettingsSelectRow from '../../components/mockTests/SettingsSelectRow'

export default function MockSettingsPage() {
  const { settings, updateSetting } = useMockSettings()

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-[#e8e8e8]">Mock Test Settings</h3>

      <div className="flex flex-col gap-3">
        <SettingsSelectRow
          label="Preferred Exam"
          description="Used to pre-select filters and recommendations across the Mock Test System."
          value={settings.preferredExam}
          onChange={(value) => updateSetting('preferredExam', value)}
          options={EXAMS}
        />
        <SettingsSelectRow
          label="Default Duration"
          description="Suggested duration in minutes when starting a new mock."
          value={String(settings.defaultDuration)}
          onChange={(value) => updateSetting('defaultDuration', Number(value))}
          options={DEFAULT_DURATION_OPTIONS.map(String)}
        />
        <SettingsSelectRow
          label="Default Difficulty"
          description="Default difficulty filter applied in the Test Library."
          value={settings.defaultDifficulty}
          onChange={(value) => updateSetting('defaultDifficulty', value)}
          options={DIFFICULTY_LEVELS}
        />
        <SettingsSelectRow
          label="Question Palette Style"
          description="Layout of the question navigator on the Attempt screen."
          value={settings.paletteStyle}
          onChange={(value) => updateSetting('paletteStyle', value)}
          options={PALETTE_STYLE_OPTIONS}
        />
        <SettingsSelectRow
          label="Theme"
          description="Physics OS currently ships with a single dark theme."
          value={settings.theme}
          onChange={(value) => updateSetting('theme', value)}
          options={['Dark']}
        />
      </div>
    </div>
  )
}
