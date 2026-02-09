export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
  profile: {
    avatar?: string
    bio?: string
    targetRole?: string
  }
  stats: {
    readinessScore: number
    questionsCompleted: number
    studyStreak: number
    totalHours: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
}
