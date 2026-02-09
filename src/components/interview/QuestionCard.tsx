import { motion } from 'framer-motion'

interface QuestionCardProps {
  question: string
  topic: string
  difficulty: string
  index: number
}

export default function QuestionCard({ question, topic, difficulty, index }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 card-glow border border-pink/10"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm px-3 py-1 rounded-full bg-peach/30">{topic}</span>
        <span className="text-sm px-3 py-1 rounded-full bg-lavender/30">{difficulty}</span>
      </div>
      <p className="text-gray-800 font-medium">{question}</p>
    </motion.div>
  )
}
