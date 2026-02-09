import { apiClient } from './api'
import { GenerateQuestionsRequest, GenerateQuestionsResponse } from '@/types/question.types'
import { ApiResponse } from '@/types/api.types'

export const questionService = {
  async generateQuestions(data: GenerateQuestionsRequest): Promise<GenerateQuestionsResponse> {
    const response = await apiClient.post<GenerateQuestionsResponse>(
      '/questions/generate',
      data
    )
    return response.data
  },

  async getRoles(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/questions/roles')
    return response.data.data!
  },

  async getTopics(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/questions/topics')
    return response.data.data!
  }
}
