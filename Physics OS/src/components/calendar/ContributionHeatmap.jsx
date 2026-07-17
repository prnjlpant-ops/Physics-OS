import { useMemo, useState } from 'react'
import { toDateKey, getDayTotalMs, getIntensityLevel } from '../../utils/calendarStats'

const INTENSITY_COLORS = [
  '#161b1c', // 0 hr - very dark
  '#0e4429', // 0-1 hr - light green
  '#006d32', // 1-2 hr - medium green
  '#26a641', // 2-4 hr - dark green
  '#39d353', // 4+ hr - bright green
]

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildWeeks(sessionsByDate, weeksCount) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

  const totalDays = weeksCount * 7
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - totalDays + 1)

  const weeks = []
  const cursor = new Date(startDate)

  for (let w = 0; w < weeksCount; w += 1) {
    const days = []
    for (let d = 0; d < 7; d += 1) {
      const key = toDateKey(cursor)
      const daySessions = sessionsByDate.get(key) || []
      const totalMs = getDayTotalMs(daySessions)
      days.push({
        date: new Date(cursor),
        key,
        totalMs,
        hours: totalMs / 3_600_000,
        sessionCount: daySessions.length,
        isFuture: cursor.getTime() > today.getTime(),
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(days)
  }

  return weeks
}

export default function ContributionHeatmap({ sessionsByDate, selectedKey, onSelectDay }) {
  const weeksCount = 53
  const weeks = useMemo(() => buildWeeks(sessionsByDate, weeksCount), [sessionsByDate])
  const [hovered, setHovered] = useState(null)

  const monthMarkers = useMemo(() => {
    const markers = []
    let lastMonth = null
    weeks.forEach((week, index) => {
      const month = week[0].date.getMonth()
      if (month !== lastMonth) {
        markers.push({ index, label: MONTH_LABELS[month] })
        lastMonth = month
      }
    })
    return markers
  }, [weeks])

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex min-w-max flex-col gap-1">
        <div className="relative ml-8 flex h-3.5">
          {weeks.map((week, index) => {
            const marker = monthMarkers.find((m) => m.index === index)
            return (
              <div key={week[0].key} className="relative w-[14px] flex-shrink-0">
                {marker && (
                  <span className="absolute -top-0.5 left-0 whitespace-nowrap text-[10px] text-[#858585]">
                    {marker.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-1">
          <div className="flex w-7 flex-col gap-1 pr-1">
            {WEEKDAY_LABELS.map((label, i) => (
              <div key={label} className="flex h-[14px] items-center text-[10px] text-[#858585]">
                {i % 2 === 1 ? label : ''}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {weeks.map((week) => (
              <div key={week[0].key} className="flex flex-col gap-1">
                {week.map((day) => {
                  const level = getIntensityLevel(day.hours)
                  const isSelected = selectedKey === day.key
                  return (
                    <button
                      key={day.key}
                      type="button"
                      disabled={day.isFuture}
                      onClick={() => onSelectDay(day)}
                      onMouseEnter={() => setHovered(day)}
                      onMouseLeave={() => setHovered(null)}
                      aria-label={`${day.key}: ${day.hours.toFixed(1)} hours, ${day.sessionCount} sessions`}
                      className={`h-[14px] w-[14px] rounded-[3px] border transition-all duration-150 ${
                        isSelected
                          ? 'border-[#e8e8e8]'
                          : 'border-[#2a2a2a] hover:border-[#6e6e6e]'
                      } ${day.isFuture ? 'cursor-default opacity-30' : 'cursor-pointer hover:scale-125'}`}
                      style={{
                        backgroundColor: day.isFuture ? '#101010' : INTENSITY_COLORS[level],
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ml-8 mt-2 h-4 text-xs text-[#858585]">
        {hovered && !hovered.isFuture && (
          <span>
            <span className="text-[#cccccc]">
              {hovered.date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>{' '}
            — {hovered.hours.toFixed(1)}h · {hovered.sessionCount} session
            {hovered.sessionCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div className="ml-8 mt-1 flex items-center gap-1.5 text-[10px] text-[#858585]">
        <span>Less</span>
        {INTENSITY_COLORS.map((color) => (
          <span key={color} className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: color }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
