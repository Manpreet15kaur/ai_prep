interface ATSScoreCircleProps {
  score: number
  size?: number
}

export default function ATSScoreCircle({ score, size = 140 }: ATSScoreCircleProps) {
  const radius = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFD4C4"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9999" />
            <stop offset="50%" stopColor="#E6D5F5" />
            <stop offset="100%" stopColor="#FFB6C1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
          {score}
        </span>
      </div>
    </div>
  )
}
