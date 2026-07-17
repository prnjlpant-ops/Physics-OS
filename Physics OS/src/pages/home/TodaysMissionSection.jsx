export default function TodaysMissionSection() {
  const tasks = [
    'No tasks scheduled',
    'No tasks scheduled',
    'No tasks scheduled',
    'No tasks scheduled',
  ]

  return (
    <section className="flex h-full flex-col rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="text-sm font-semibold text-[#e8e8e8]">Today&apos;s Mission</h2>
      <ul className="mt-4 flex flex-1 flex-col gap-2.5">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex items-center gap-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2.5 text-sm text-[#858585] transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <span className="shrink-0 text-base leading-none text-[#6e6e6e]">□</span>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
