import { apiClient } from './api'
import { SavedQuestion } from '@/types/question.types'
import { ApiResponse } from '@/types/api.types'

export const vaultService = {
  async getAllQuestions(): Promise<SavedQuestion[]> {
    const response = await apiClient.get<ApiResponse<SavedQuestion[]>>('/vault')
    return response.data.data!
  },

  async getQuestion(id: string): Promise<SavedQuestion> {
    const response = await apiClient.get<ApiResponse<SavedQuestion>>(`/vault/${id}`)
    return response.data.data!
  },

  async createQuestion(data: Partial<SavedQuestion>): Promise<SavedQuestion> {
    const response = await apiClient.post<ApiResponse<SavedQuestion>>('/vault', data)
    return response.data.data!
  },

  async updateQuestion(id: string, data: Partial<SavedQuestion>): Promise<SavedQuestion> {
    const response = await apiClient.put<ApiResponse<SavedQuestion>>(`/vault/${id}`, data)
    return response.data.data!
  },

  async deleteQuestion(id: string): Promise<void> {
    await apiClient.delete(`/vault/${id}`)
  },

  async toggleBookmark(id: string): Promise<SavedQuestion> {
    const response = await apiClient.patch<ApiResponse<SavedQuestion>>(`/vault/${id}/bookmark`)
    return response.data.data!
  }
}
