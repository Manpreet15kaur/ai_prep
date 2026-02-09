import { ReactNode } from 'react'

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: ReactNode
  label?: string
  className?: string
}

export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon,
  label,
  className = ''
}: InputProps) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all`}
        />
      </div>
    </div>
  )
}
