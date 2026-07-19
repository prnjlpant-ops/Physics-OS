export default function AnalyticsColumnChart({ series, formatValue, height = 120 }) {
  const max = Math.max(...series.map((s) => s.ms), 1)

  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {series.map((point) => {
        const barHeight = Math.max(Math.round((point.ms / max) * (height - 20)), point.ms > 0 ? 3 : 1)
        return (
          <div key={point.key ?? point.label} className="group flex flex-1 flex-col items-center gap-1.5">
            <div className="relative flex w-full flex-1 items-end justify-center">
              <div
                className={`w-full max-w-[18px] rounded-t-sm transition-colors duration-150 ${
                  point.ms > 0 ? 'bg-[#0e639c] group-hover:bg-[#1177bb]' : 'bg-[#3c3c3c]'
                }`}
                style={{ height: barHeight }}
                title={formatValue ? formatValue(point.ms) : `${(point.ms / 3_600_000).toFixed(1)}h`}
              />
            </div>
            <span className="whitespace-nowrap text-[9px] text-[#6e6e6e]">{point.label}</span>
          </div>
        )
      })}
    </div>
  )
}
