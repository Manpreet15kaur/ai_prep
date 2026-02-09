interface DifficultySelectorProps {
  difficulties: string[]
  selected: string
  onSelect: (difficulty: string) => void
}

export default function DifficultySelector({ difficulties, selected, onSelect }: DifficultySelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
      <h3 className="font-semibold text-lg mb-4">Difficulty Level</h3>
      <div className="flex gap-3">
        {difficulties.map(level => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`flex-1 py-3 rounded-xl transition-all ${
              selected === level
                ? 'gradient-pastel text-white'
                : 'bg-lavender/30 text-gray-700 hover:bg-lavender/50'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  )
}
