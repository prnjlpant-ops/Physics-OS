import TopicCard from './TopicCard'

export default function TopicGrid({ topics, showBreadcrumb = true, emptyLabel = 'No topics found' }) {
  if (!topics.length) {
    return (
      <div className="rounded-lg border border-dashed border-[#3c3c3c] px-4 py-10 text-center text-xs text-[#6e6e6e]">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} showBreadcrumb={showBreadcrumb} />
      ))}
    </div>
  )
}
