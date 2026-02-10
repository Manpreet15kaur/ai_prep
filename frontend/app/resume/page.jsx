'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target, Loader2, BarChart3, Award } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const analyzeResume = async () => {
    if (!file) {
      alert('Please upload a resume first')
      return
    }
    
    if (!jobDescription.trim()) {
      alert('Please paste a job description')
      return
    }
    
    setAnalyzing(true)
    
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jobDescription)

      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setResults(result.analysis)
      } else {
        alert('Failed to analyze resume: ' + result.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to analyze resume. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-3">ATS Resume Analyzer</h2>
            <p className="text-gray-600 mb-8">Get deterministic ATS score and actionable improvements</p>
          </motion.div>

          {/* Input Section - Compact */}
          <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Resume Upload */}
              <div>
                <h3 className="font-semibold mb-3">Upload Resume</h3>
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-pink/30 rounded-xl p-6 text-center cursor-pointer hover:border-coral transition-all hover:bg-peach/10">
                    <Upload className="mx-auto mb-2 text-coral" size={32} />
                    <p className="font-medium text-sm">Click to upload</p>
                    <p className="text-xs text-gray-500">PDF or DOCX (Max 5MB)</p>
                  </div>
                </label>

                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-peach/20 rounded-xl flex items-center gap-2"
                  >
                    <FileText className="text-coral" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Job Description */}
              <div>
                <h3 className="font-semibold mb-3">Paste Job Description</h3>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-32 p-3 rounded-xl border border-pink/20 focus:outline-none focus:border-coral transition-all resize-none text-sm"
                />
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeResume}
              disabled={!file || !jobDescription.trim() || analyzing}
              className="w-full mt-6 py-3 rounded-xl gradient-pastel text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-glow transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Analyzing Resume...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* ATS Score */}
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10 text-center">
                    <h3 className="font-semibold mb-4">ATS Score</h3>
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#FFD4C4"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="url(#gradient)"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - results.atsScore / 100)}`}
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
                        <span className="text-3xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                          {results.atsScore}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {results.atsScore >= 80 ? 'Excellent!' : results.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </p>
                  </div>

                  {/* Selection Probability */}
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10 text-center">
                    <h3 className="font-semibold mb-4">Selection Probability</h3>
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#E0F2FE"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#3B82F6"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - results.selectionProbability / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue">
                          {results.selectionProbability}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Resume shortlist chance</p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 size={20} className="text-coral" />
                      Score Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skills Match (50%)</span>
                        <span className="font-semibold">
                          {((results.breakdown?.skillsScore || 0) / 100 * 50).toFixed(1)}/50
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Projects (20%)</span>
                        <span className="font-semibold">
                          {((results.breakdown?.projectsScore || 0) / 100 * 20).toFixed(1)}/20
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Keywords (20%)</span>
                        <span className="font-semibold">
                          {((results.breakdown?.keywordsScore || 0) / 100 * 20).toFixed(1)}/20
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Education (5%)</span>
                        <span className="font-semibold">
                          {((results.breakdown?.educationScore || 0) / 100 * 5).toFixed(1)}/5
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certifications (5%)</span>
                        <span className="font-semibold">
                          {((results.breakdown?.certificationsScore || 0) / 100 * 5).toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matched Skills */}
                {results.matchedSkills && results.matchedSkills.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="text-mint" size={24} />
                      <h3 className="font-semibold text-lg">Matched Skills ({results.matchedSkills.length})</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.matchedSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 rounded-full bg-mint/30 text-gray-700 font-medium text-sm border border-mint/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Partial Matches */}
                {results.partialSkills && results.partialSkills.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="text-yellow-600" size={24} />
                      <h3 className="font-semibold text-lg">Partial Matches ({results.partialSkills.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.partialSkills.map((match, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-yellow/10 rounded-lg">
                          <div>
                            <span className="font-medium">{match.resume}</span>
                            <span className="text-gray-500 mx-2">≈</span>
                            <span className="text-gray-600">{match.jd}</span>
                          </div>
                          <span className="text-sm font-semibold text-yellow-700">
                            {Math.round(match.similarity * 100)}% match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {results.missingSkills && results.missingSkills.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="text-coral" size={24} />
                      <h3 className="font-semibold text-lg">Missing Skills ({results.missingSkills.length})</h3>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">Add these skills to improve your ATS score:</p>
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 rounded-full bg-coral/30 text-gray-700 font-medium text-sm border border-coral/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {results.missingKeywords && results.missingKeywords.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="text-coral" size={24} />
                      <h3 className="font-semibold text-lg">Missing Keywords ({results.missingKeywords.length})</h3>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">Important keywords from job description not found in resume:</p>
                    <div className="flex flex-wrap gap-2">
                      {results.missingKeywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1.5 rounded-full bg-pink/30 text-gray-700 font-medium text-sm border border-pink/50">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Relevance */}
                {results.projectRelevance && results.projectRelevance.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="text-purple" size={24} />
                      <h3 className="font-semibold text-lg">Project Relevance</h3>
                    </div>
                    <div className="space-y-3">
                      {results.projectRelevance.map((project, index) => (
                        <div key={index} className="p-4 bg-purple/10 rounded-lg border-l-4 border-purple">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{project.name}</h4>
                            <span className="text-sm font-bold text-purple">{Math.round(project.relevance)}% relevant</span>
                          </div>
                          <p className="text-sm text-gray-600">{project.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Gaps */}
                {results.projectGaps && results.projectGaps.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="text-coral" size={24} />
                      <h3 className="font-semibold text-lg">Project Gaps</h3>
                    </div>
                    <ul className="space-y-2">
                      {results.projectGaps.map((gap, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-coral mt-1">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvement Suggestions */}
                {results.improvements && results.improvements.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="text-coral" size={24} />
                      <h3 className="font-semibold text-lg">Improvement Suggestions</h3>
                    </div>
                    <div className="space-y-3">
                      {results.improvements.map((item, index) => (
                        <div key={index} className="p-4 bg-peach/10 rounded-xl border-l-4 border-coral">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{item.area}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.priority === 'High' ? 'bg-coral/30 text-coral' :
                              item.priority === 'Medium' ? 'bg-yellow/30 text-yellow-700' :
                              'bg-blue/30 text-blue'
                            }`}>
                              {item.priority} Priority
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{item.suggestion}</p>
                          {item.impact && (
                            <p className="text-sm text-gray-600 italic">Impact: {item.impact}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ProtectedRoute>
  )
}
