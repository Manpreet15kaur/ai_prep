import { apiClient } from './api'
import { ResumeAnalysis, AnalyzeResumeResponse } from '@/types/resume.types'
import { ApiResponse } from '@/types/api.types'

export const resumeService = {
  async uploadResume(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('resume', file)

    const response = await apiClient.post<ApiResponse<{ fileUrl: string }>>(
      '/resume/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data!.fileUrl
  },

  async analyzeResume(fileUrl: string): Promise<ResumeAnalysis> {
    const response = await apiClient.post<AnalyzeResumeResponse>('/resume/analyze', {
      fileUrl,
    })
    return response.data.analysis
  },

  async getAnalysisHistory(): Promise<ResumeAnalysis[]> {
    const response = await apiClient.get<ApiResponse<ResumeAnalysis[]>>('/resume/history')
    return response.data.data!
  },

  async getAnalysis(id: string): Promise<ResumeAnalysis> {
    const response = await apiClient.get<ApiResponse<ResumeAnalysis>>(`/resume/${id}`)
    return response.data.data!
  }
}
