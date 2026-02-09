import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, type = 'success', isVisible, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="text-mint" size={20} />,
    error: <AlertCircle className="text-coral" size={20} />,
    info: <CheckCircle className="text-blue" size={20} />
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 glass rounded-xl p-4 border border-pink/20 shadow-glow flex items-center gap-3 z-50"
        >
          {icons[type]}
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="ml-2">
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
