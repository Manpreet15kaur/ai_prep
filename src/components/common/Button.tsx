import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  className?: string
  icon?: ReactNode
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'gradient-pastel text-white shadow-soft hover:shadow-glow',
    secondary: 'bg-white border border-pink/20 text-gray-700 hover:bg-peach/10',
    outline: 'bg-transparent border-2 border-coral text-coral hover:bg-coral hover:text-white'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon && icon}
      {children}
    </motion.button>
  )
}
