'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const analyzeResume = () => {
    if (!file) {
      alert('Please upload a resume first')
      return
    }
    
    setAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setResults({
        atsScore: 78,
        matchedKeywords: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'Git', 'Agile'],
        missingKeywords: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Microservices', 'Cloud Architecture'],
        missingSkills: ['Container orchestration', 'Cloud deployment', 'DevOps practices'],
        strengths: [
          'Strong technical skills section',
          'Quantified achievements',
          'Clear project descriptions',
          'Good keyword density'
        ],
        weaknesses: [
          'Missing action verbs in experience section',
          'Inconsistent date formatting',
          'Limited leadership examples',
          'No certifications listed'
        ],
        improvements: [
          { area: 'Experience Section', suggestion: 'Add more action verbs like "Led", "Architected", "Optimized"', priority: 'High' },
          { area: 'Skills', suggestion: 'Include trending technologies like Kubernetes, GraphQL', priority: 'Medium' },
          { area: 'Projects', suggestion: 'Add metrics and impact statements to each project', priority: 'High' },
          { area: 'Format', suggestion: 'Use consistent date format (MM/YYYY)', priority: 'Low' },
        ]
      })
      setAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20">
      {/* Header */}
      <header className="glass border-b border-pink/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                Interview Prep AI
              </h1>
            </Link>
            <nav className="flex gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-coral transition">Dashboard</Link>
              <Link href="/vault" className="text-gray-600 hover:text-coral transition">My Vault</Link>
              <Link href="/resume" className="text-coral font-medium">Resume Analyzer</Link>
              <Link href="/profile" className="text-gray-600 hover:text-coral transition">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-3">Resume AI Analyzer</h2>
          <p className="text-gray-600 mb-12">Get instant ATS score and improvement suggestions</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-6">Upload Your Resume</h3>
              
              <label className="block">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-pink/30 rounded-xl p-12 text-center cursor-pointer hover:border-coral transition-all hover:bg-peach/10">
                  <Upload className="mx-auto mb-4 text-coral" size={48} />
                  <p className="font-medium mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF or DOCX (Max 5MB)</p>
                </div>
              </label>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-peach/20 rounded-xl flex items-center gap-3"
                >
                  <FileText className="text-coral" size={24} />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeResume}
                disabled={!file || analyzing}
                className="w-full mt-6 py-4 rounded-xl gradient-pastel text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-glow transition-all"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Resume'}
              </motion.button>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* ATS Score */}
              <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10 text-center">
                <h3 className="font-semibold text-lg mb-6">ATS Score</h3>
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#FFD4C4"
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
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - results.atsScore / 100)}`}
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
                      {results.atsScore}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">Your resume is performing well!</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 card-glow border border-pink/10">
                  <CheckCircle className="text-mint mb-2" size={24} />
                  <p className="text-2xl font-bold">{results.matchedKeywords?.length || 0}</p>
                  <p className="text-sm text-gray-600">Matched Keywords</p>
                </div>
                <div className="bg-white rounded-xl p-4 card-glow border border-pink/10">
                  <AlertCircle className="text-coral mb-2" size={24} />
                  <p className="text-2xl font-bold">{results.missingKeywords?.length || 0}</p>
                  <p className="text-sm text-gray-600">Missing Keywords</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Detailed Analysis */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 space-y-6"
          >
            {/* Strengths */}
            <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-mint" size={28} />
                <h3 className="font-semibold text-xl">Resume Strengths</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {results.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-mint/20 rounded-xl">
                    <CheckCircle className="text-mint flex-shrink-0 mt-1" size={18} />
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas of Improvement */}
            <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-coral" size={28} />
                <h3 className="font-semibold text-xl">Areas of Improvement</h3>
              </div>
              <div className="space-y-4">
                {results.improvements.map((item, index) => (
                  <div key={index} className="p-5 bg-peach/10 rounded-xl border-l-4 border-coral">
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
                    <p className="text-gray-600">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Keywords */}
            {results.matchedKeywords && results.matchedKeywords.length > 0 && (
              <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="text-mint" size={28} />
                  <h3 className="font-semibold text-xl">Matched Keywords</h3>
                </div>
                <p className="text-gray-600 mb-4">These keywords from the job description are present in your resume:</p>
                <div className="flex flex-wrap gap-3">
                  {results.matchedKeywords.map((keyword, index) => (
                    <span key={index} className="px-4 py-2 rounded-full bg-mint/30 text-gray-700 font-medium border border-mint/50">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {results.missingKeywords && results.missingKeywords.length > 0 && (
              <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-coral" size={28} />
                  <h3 className="font-semibold text-xl">Missing Keywords</h3>
                </div>
                <p className="text-gray-600 mb-4">Add these keywords to improve ATS compatibility:</p>
                <div className="flex flex-wrap gap-3">
                  {results.missingKeywords.map((keyword, index) => (
                    <span key={index} className="px-4 py-2 rounded-full bg-coral/30 text-gray-700 font-medium border border-coral/50">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
