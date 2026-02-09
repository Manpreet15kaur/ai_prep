import { motion } from 'framer-motion'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface RoleCardProps {
  id: number
  title: string
  icon: LucideIcon
  color: string
  skills: string[]
  experience: string
  questions: number
  index: number
}

export default function RoleCard({ 
  id, 
  title, 
  icon: Icon, 
  color, 
  skills, 
  experience, 
  questions, 
  index 
}: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/interview/${id}`}>
        <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10 cursor-pointer h-full">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
            <Icon className="text-white" size={28} />
          </div>
          
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full bg-peach/30 text-xs font-medium text-gray-700">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-lavender/30">{experience}</span>
            <span className="font-medium">{questions} Q&A</span>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            Last updated: 2 days ago
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
