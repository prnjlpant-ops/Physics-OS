import ResourceCard from './ResourceCard'

/** Backward-compatible topic wrapper around the shared resource card. */
export default function TopicResourceCard({ resource }) {
  return <ResourceCard resource={resource} />
}
