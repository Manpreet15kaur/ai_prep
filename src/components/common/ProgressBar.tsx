import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  label?: string
  showPercentage?: boolean
  color?: string
  delay?: number
}

export default function ProgressBar({ 
  progress, 
  label, 
  showPercentage = true,
  color = 'gradient-pastel',
  delay = 0
}: ProgressBarProps) {
  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{label}</span>
          {showPercentage && <span className="text-sm text-gray-600">{progress}%</span>}
        </div>
      )}
      <div className="relative h-3 bg-peach/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay, duration: 0.8 }}
          className={`absolute h-full ${color} rounded-full`}
        />
      </div>
    </div>
  )
}
