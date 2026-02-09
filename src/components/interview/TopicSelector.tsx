interface TopicSelectorProps {
  topics: string[]
  selectedTopics: string[]
  onToggle: (topic: string) => void
}

export default function TopicSelector({ topics, selectedTopics, onToggle }: TopicSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
      <h3 className="font-semibold text-lg mb-4">Select Topics</h3>
      <div className="flex flex-wrap gap-3">
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => onToggle(topic)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedTopics.includes(topic)
                ? 'gradient-pastel text-white'
                : 'bg-peach/30 text-gray-700 hover:bg-peach/50'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  )
}
