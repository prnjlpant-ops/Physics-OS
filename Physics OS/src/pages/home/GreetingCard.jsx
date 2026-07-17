function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function GreetingCard() {
  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="text-xl font-semibold text-[#e8e8e8]">{getGreeting()}</h2>
      <p className="mt-1 text-sm text-[#9d9d9d]">Welcome back, Pranjal</p>
    </section>
  )
}
