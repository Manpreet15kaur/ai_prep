export interface ResumeAnalysis {
  _id: string
  userId: string
  fileName: string
  fileUrl: string
  atsScore: number
  analysis: {
    strengths: string[]
    weaknesses: string[]
    missingKeywords: string[]
    improvements: Improvement[]
  }
  parsedContent: {
    skills: string[]
    experience: string[]
    education: string[]
  }
  createdAt: string
}

export interface Improvement {
  area: string
  suggestion: string
  priority: 'Low' | 'Medium' | 'High'
}

export interface AnalyzeResumeResponse {
  success: boolean
  analysis: ResumeAnalysis
}
