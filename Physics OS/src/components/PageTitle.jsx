export default function PageTitle({ title }) {
  return (
    <div className="flex h-full min-h-[calc(100dvh-3rem)] items-center justify-center">
      <h2 className="text-2xl font-medium text-[#cccccc]">{title}</h2>
    </div>
  )
}
