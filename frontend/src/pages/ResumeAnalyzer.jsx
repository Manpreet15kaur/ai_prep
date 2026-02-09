import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target, Trash2 } from 'lucide-react'

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/resume/history')
      setHistory(response.data.analyses)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError('')
    } else {
      setError('Please select a PDF file')
    }
  }

  const analyzeResume = async () => {
    if (!file || !jobDescription) {
      setError('Please upload a resume and provide job description')
      return
    }

    setError('')
    setAnalyzing(true)

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('jobDescription', jobDescription)

    try {
      const response = await axios.post('/api/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setCurrentAnalysis(response.data.analysis)
      fetchHistory()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume')
    } finally {
      setAnalyzing(false)
    }
  }

  const deleteAnalysis = async (id) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return

    try {
      await axios.delete(`/api/resume/${id}`)
      setHistory(prev => prev.filter(a => a._id !== id))
      if (currentAnalysis?._id === id) {
        setCurrentAnalysis(null)
      }
    } catch (error) {
      console.error('Error deleting analysis:', error)
    }
  }

  const viewAnalysis = async (id) => {
    try {
      const response = await axios.get(`/api/resume/${id}`)
      setCurrentAnalysis(response.data.analysis)
    } catch (error) {
      console.error('Error fetching analysis:', error)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2">Resume ATS Analyzer</h1>
          <p className="text-gray-600 mb-12">Get instant ATS score and improvement suggestions</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Upload Resume</h3>
              
              <label className="block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-primary-500 transition-all hover:bg-primary-50/50">
                  <Upload className="mx-auto mb-4 text-primary-600" size={48} />
                  <p className="font-medium mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF only (Max 5MB)</p>
                </div>
              </label>

              {file && (
                <div className="mt-4 p-4 bg-primary-50 rounded-xl flex items-center gap-3">
                  <FileText className="text-primary-600" size={24} />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              )}
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Job Description (Required)</h3>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="input-field"
                rows={8}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={analyzing || !file || !jobDescription}
              className="btn-primary w-full"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>

          {/* Results Section */}
          <div>
            {currentAnalysis ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* ATS Score */}
                <div className="card p-8 text-center">
                  <h3 className="font-semibold text-lg mb-6">ATS Score</h3>
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="transform -rotate-90 w-40 h-40">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - currentAnalysis.atsScore / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7c6ff0" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary-600">
                        {currentAnalysis.atsScore}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {currentAnalysis.atsScore >= 80 ? 'Excellent!' : 
                     currentAnalysis.atsScore >= 60 ? 'Good progress' : 
                     'Needs improvement'}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="card p-4">
                    <CheckCircle className="text-green-600 mb-2" size={24} />
                    <p className="text-2xl font-bold">{currentAnalysis.matchedKeywords?.length || 0}</p>
                    <p className="text-sm text-gray-600">Matched Keywords</p>
                  </div>
                  <div className="card p-4">
                    <AlertCircle className="text-orange-600 mb-2" size={24} />
                    <p className="text-2xl font-bold">{currentAnalysis.missingSkills?.length || 0}</p>
                    <p className="text-sm text-gray-600">Missing Skills</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="card p-12 text-center">
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-gray-600">Upload your resume and job description to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Analysis */}
        {currentAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 space-y-6"
          >
            {/* Missing Skills */}
            {currentAnalysis.missingSkills && currentAnalysis.missingSkills.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-orange-600" size={28} />
                  <h3 className="font-semibold text-xl">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentAnalysis.missingSkills.map((skill, index) => (
                    <span key={index} className="badge bg-orange-100 text-orange-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {currentAnalysis.improvements && currentAnalysis.improvements.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-primary-600" size={28} />
                  <h3 className="font-semibold text-xl">Improvement Suggestions</h3>
                </div>
                <div className="space-y-4">
                  {currentAnalysis.improvements.map((item, index) => (
                    <div key={index} className="p-4 bg-primary-50 rounded-xl border-l-4 border-primary-600">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{item.area}</h4>
                        <span className={`badge ${
                          item.priority === 'High' ? 'bg-red-100 text-red-700' :
                          item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-gray-700">{item.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-display font-bold mb-6">Analysis History</h2>
            <div className="space-y-4">
              {history.map((analysis) => (
                <div key={analysis._id} className="card p-6 flex justify-between items-center">
                  <div className="flex-1 cursor-pointer" onClick={() => viewAnalysis(analysis._id)}>
                    <h3 className="font-semibold mb-2">{analysis.fileName}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {analysis.atsScore}
                      </div>
                      <div className="text-sm text-gray-600">ATS Score</div>
                    </div>
                    <button
                      onClick={() => deleteAnalysis(analysis._id)}
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default ResumeAnalyzer
