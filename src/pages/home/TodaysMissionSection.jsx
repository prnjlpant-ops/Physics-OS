export default function TodaysMissionSection() {
  return (
    <section className="flex h-full flex-col rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="text-sm font-semibold text-[#e8e8e8]">Today&apos;s Mission</h2>
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-[#858585]">No tasks scheduled.</p>
      </div>
    </section>
  )
}
