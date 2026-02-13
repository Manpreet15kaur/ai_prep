'use client'

export default function PasswordStrength({ password }) {
  const calculateStrength = (pwd) => {
    let strength = 0
    
    if (pwd.length >= 8) strength++
    if (pwd.length >= 12) strength++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++
    
    return strength
  }

  const getStrengthInfo = (strength) => {
    if (strength === 0) return { label: '', color: '', width: '0%' }
    if (strength <= 2) return { label: 'Weak', color: 'bg-rose-red', width: '33%' }
    if (strength <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' }
    return { label: 'Strong', color: 'bg-emerald', width: '100%' }
  }

  const strength = calculateStrength(password)
  const info = getStrengthInfo(strength)

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">Password strength:</span>
        <span className={`text-xs font-semibold ${info.color.replace('bg-', 'text-')}`}>
          {info.label}
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${info.color} transition-all duration-300 ease-out`}
          style={{ width: info.width }}
        />
      </div>
      <div className="mt-2 space-y-1">
        <PasswordRequirement met={password.length >= 8} text="At least 8 characters" />
        <PasswordRequirement met={/[a-z]/.test(password) && /[A-Z]/.test(password)} text="Upper & lowercase letters" />
        <PasswordRequirement met={/\d/.test(password)} text="At least one number" />
        <PasswordRequirement met={/[^a-zA-Z0-9]/.test(password)} text="Special character (!@#$%)" />
      </div>
    </div>
  )
}

function PasswordRequirement({ met, text }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-emerald' : 'bg-gray-300'}`} />
      <span className={met ? 'text-emerald' : 'text-gray-500'}>{text}</span>
    </div>
  )
}
