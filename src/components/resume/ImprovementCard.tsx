interface ImprovementCardProps {
  area: string
  suggestion: string
  priority: 'Low' | 'Medium' | 'High'
}

export default function ImprovementCard({ area, suggestion, priority }: ImprovementCardProps) {
  const priorityColors = {
    High: 'bg-coral/30 text-coral',
    Medium: 'bg-yellow/30 text-yellow-700',
    Low: 'bg-blue/30 text-blue'
  }

  return (
    <div className="p-5 bg-peach/10 rounded-xl border-l-4 border-coral">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800">{area}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
          {priority} Priority
        </span>
      </div>
      <p className="text-gray-600">{suggestion}</p>
    </div>
  )
}
