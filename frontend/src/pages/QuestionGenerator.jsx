import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Sparkles, Save, CheckCircle, AlertCircle } from 'lucide-react'

const topics = ['DSA', 'Java', 'React', 'Node.js', 'DBMS', 'OS', 'System Design', 'Python', 'JavaScript', 'SQL']
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced']
const questionTypes = ['MCQ', 'Coding', 'Conceptual', 'Scenario-based', 'HR/Behavioral']

const QuestionGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    experienceLevel: 'Intermediate',
    questionTypes: []
  })
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedQuestions, setSavedQuestions] = useState(new Set())

  const handleTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type]
    }))
  }

  const generateQuestions = async () => {
    if (!formData.topic || formData.questionTypes.length === 0) {
      setError('Please select a topic and at least one question type')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/questions/generate', formData)
      setQuestions(response.data.questions)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions')
    } finally {
      setLoading(false)
    }
  }

  const saveQuestion = async (question) => {
    try {
      await axios.post('/api/questions/save', question)
      setSavedQuestions(prev => new Set([...prev, question.question]))
    } catch (err) {
      console.error('Error saving question:', err)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2">AI Question Generator</h1>
          <p className="text-gray-600 mb-12">Generate personalized interview questions</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Selection */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Select Topic</h3>
              <div className="flex flex-wrap gap-3">
                {topics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setFormData({ ...formData, topic })}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      formData.topic === topic
                        ? 'bg-gradient-to-r from-primary-600 to-lavender-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Experience Level</h3>
              <div className="grid grid-cols-3 gap-3">
                {experienceLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, experienceLevel: level })}
                    className={`py-3 rounded-xl transition-all ${
                      formData.experienceLevel === level
                        ? 'bg-gradient-to-r from-primary-600 to-lavender-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Types */}
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Question Types (Multi-select)</h3>
              <div className="flex flex-wrap gap-3">
                {questionTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      formData.questionTypes.includes(type)
                        ? 'bg-gradient-to-r from-primary-600 to-lavender-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={generateQuestions}
              disabled={loading}
              className="btn-primary w-full text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Questions
                </>
              )}
            </button>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Selection Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Topic:</span>
                  <span className="ml-2 font-medium">{formData.topic || 'Not selected'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Level:</span>
                  <span className="ml-2 font-medium">{formData.experienceLevel}</span>
                </div>
                <div>
                  <span className="text-gray-600">Types:</span>
                  <span className="ml-2 font-medium">
                    {formData.questionTypes.length || 'None selected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Questions */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-6"
          >
            <h2 className="text-2xl font-display font-bold">Generated Questions</h2>
            {questions.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="badge bg-primary-100 text-primary-700">{q.topic}</span>
                    <span className="badge bg-lavender-100 text-lavender-700">{q.experienceLevel}</span>
                  </div>
                  <button
                    onClick={() => saveQuestion(q)}
                    disabled={savedQuestions.has(q.question)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      savedQuestions.has(q.question)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                  >
                    {savedQuestions.has(q.question) ? (
                      <>
                        <CheckCircle size={18} />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save
                      </>
                    )}
                  </button>
                </div>
                
                <h3 className="font-semibold text-lg mb-3">{q.question}</h3>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Answer:</h4>
                  <p className="text-gray-700">{q.answer}</p>
                </div>
                
                {q.hints && (
                  <div className="bg-primary-50 rounded-xl p-4">
                    <h4 className="font-medium text-sm text-primary-700 mb-2">Hints:</h4>
                    <p className="text-gray-700">{q.hints}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default QuestionGenerator
