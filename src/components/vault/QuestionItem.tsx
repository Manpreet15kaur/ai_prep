import { Edit2, Trash2, Bookmark } from 'lucide-react'

interface QuestionItemProps {
  id: number
  question: string
  role: string
  topic: string
  difficulty: string
  bookmarked: boolean
  createdAt: string
  isEditing: boolean
  editText: string
  onEdit: (id: number, text: string) => void
  onSave: (id: number) => void
  onCancel: () => void
  onDelete: (id: number) => void
  onToggleBookmark: (id: number) => void
  onEditTextChange: (text: string) => void
}

export default function QuestionItem({
  id,
  question,
  role,
  topic,
  difficulty,
  bookmarked,
  createdAt,
  isEditing,
  editText,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleBookmark,
  onEditTextChange
}: QuestionItemProps) {
  return (
    <div className="bg-white rounded-xl p-6 card-glow border border-pink/10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-peach/30 text-xs font-medium">{topic}</span>
          <span className="px-3 py-1 rounded-full bg-lavender/30 text-xs font-medium">{difficulty}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onToggleBookmark(id)}
            className={`p-2 rounded-lg transition-all ${
              bookmarked ? 'bg-yellow/30 text-coral' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => onEdit(id, question)}
            className="p-2 rounded-lg bg-blue/20 text-blue hover:bg-blue/30 transition-all"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 rounded-lg bg-coral/20 text-coral hover:bg-coral/30 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            className="w-full p-3 rounded-lg border border-pink/20 focus:outline-none focus:border-coral"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={() => onSave(id)}
              className="px-4 py-2 rounded-lg gradient-pastel text-white font-medium"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 font-medium mb-3">{question}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{role}</span>
            <span>Added {createdAt}</span>
          </div>
        </>
      )}
    </div>
  )
}
