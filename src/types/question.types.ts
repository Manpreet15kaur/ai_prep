export interface InterviewQuestion {
  _id: string
  question: string
  role: string
  topic: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  techStack: string[]
  answer?: string
  hints?: string[]
  isGenerated: boolean
  createdAt: string
}

export interface SavedQuestion {
  _id: string
  userId: string
  questionId?: string
  customQuestion?: string
  question: string
  role: string
  topic: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  bookmarked: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface GenerateQuestionsRequest {
  role: string
  topics: string[]
  difficulty: string
  techStack: string[]
}

export interface GenerateQuestionsResponse {
  success: boolean
  questions: InterviewQuestion[]
  savedCount: number
}
