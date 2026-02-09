interface TechStackSelectorProps {
  techStacks: string[]
  selectedTech: string[]
  onToggle: (tech: string) => void
}

export default function TechStackSelector({ techStacks, selectedTech, onToggle }: TechStackSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
      <h3 className="font-semibold text-lg mb-4">Tech Stack</h3>
      <div className="flex flex-wrap gap-3">
        {techStacks.map(tech => (
          <button
            key={tech}
            onClick={() => onToggle(tech)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedTech.includes(tech)
                ? 'bg-gradient-to-r from-blue to-lavender text-white'
                : 'bg-blue/30 text-gray-700 hover:bg-blue/50'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  )
}
