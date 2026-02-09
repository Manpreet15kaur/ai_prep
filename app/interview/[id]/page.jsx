'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Save, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const difficulties = ['Beginner', 'Intermediate', 'Advanced']
const questionTypes = ['MCQ', 'Coding', 'Conceptual', 'Scenario-based']

const roleTopicsMap = {
  '1': ['React', 'TypeScript', 'CSS'],
  '2': ['Node.js', 'SQL', 'APIs'],
  '3': ['MERN', 'DevOps', 'AWS'],
  '4': ['Python', 'SQL', 'Tableau'],
  '5': ['Docker', 'K8s', 'CI/CD'],
  '6': ['Figma', 'Design Systems'],
  '7': ['React Native', 'Swift'],
  '8': ['Python', 'TensorFlow', 'ML'],
  '9': ['Strategy', 'Analytics', 'Agile']
}

export default function InterviewGeneratorPage() {
  const params = useParams()
  const roleId = params?.id
  
  const [availableTopics, setAvailableTopics] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([])
  
  const [topicSubTopicsMap, setTopicSubTopicsMap] = useState({})
  const [selectedSubTopics, setSelectedSubTopics] = useState([])
  
  const [answerStyle, setAnswerStyle] = useState('')
  
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [expandedQuestion, setExpandedQuestion] = useState(null)

  useEffect(() => {
    if (roleId && roleTopicsMap[roleId]) {
      setAvailableTopics(roleTopicsMap[roleId])
    }
  }, [roleId])

  useEffect(() => {
    if (selectedTopics.length > 0) {
      selectedTopics.forEach(topic => {
        if (!topicSubTopicsMap[topic]) {
          fetchSubTopics(topic)
        }
      })
    } else {
      setTopicSubTopicsMap({})
      setSelectedSubTopics([])
    }
  }, [selectedTopics])

  const fetchSubTopics = async (topic) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/subtopics/${topic}`)
      const data = await response.json()
      if (data.success) {
        setTopicSubTopicsMap(prev => ({
          ...prev,
          [topic]: data.subTopics || []
        }))
      }
    } catch (error) {
      console.error('Error fetching sub-topics:', error)
    }
  }

  const saveQuestion = (question) => {
    const saved = localStorage.getItem('savedQuestions')
    const existing = saved ? JSON.parse(saved) : []
    const newQuestion = {
      ...question,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      bookmarked: false
    }
    const updated = [...existing, newQuestion]
    localStorage.setItem('savedQuestions', JSON.stringify(updated))
    setToastMessage('Question saved to vault!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const toggleTopic = (topic) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        // Remove topic and its sub-topics from selection
        const updatedTopics = prev.filter(t => t !== topic)
        const topicSubTopics = topicSubTopicsMap[topic] || []
        setSelectedSubTopics(prevSub => prevSub.filter(st => !topicSubTopics.includes(st)))
        return updatedTopics
      } else {
        return [...prev, topic]
      }
    })
  }

  const toggleQuestionType = (type) => {
    setSelectedQuestionTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleSubTopic = (subTopic) => {
    setSelectedSubTopics(prev => 
      prev.includes(subTopic) ? prev.filter(t => t !== subTopic) : [...prev, subTopic]
    )
  }

  const generateQuestions = async () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic')
      return
    }

    if (!answerStyle.trim()) {
      alert('Please enter an answer style')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topics: selectedTopics,
          experienceLevel: difficulty,
          questionTypes: selectedQuestionTypes,
          subTopics: selectedSubTopics,
          programmingLanguage: null,
          answerStyle: answerStyle
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setQuestions(data.questions)
      } else {
        alert(data.message || 'Failed to generate questions')
      }
    } catch (error) {
      console.error('Error generating questions:', error)
      alert('Failed to generate questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20">
      {/* Header */}
      <header className="glass border-b border-pink/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                Interview Prep AI
              </h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-3">AI Interview Generator</h2>
          <p className="text-gray-600 mb-12">Customize your interview preparation</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Topic Selection */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Select Topics</h3>
              <div className="flex flex-wrap gap-3">
                {availableTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedTopics.includes(topic)
                        ? 'gradient-pastel text-white'
                        : 'bg-peach/30 text-gray-700 hover:bg-peach/50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Topics */}
            {selectedTopics.length > 0 && Object.keys(topicSubTopicsMap).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 card-glow border border-pink/10"
              >
                <h3 className="font-semibold text-lg mb-4">Select Sub-Topics (Optional)</h3>
                {selectedTopics.map(topic => {
                  const subTopics = topicSubTopicsMap[topic] || []
                  if (subTopics.length === 0) return null
                  return (
                    <div key={topic} className="mb-4 last:mb-0">
                      <p className="text-sm font-medium text-gray-600 mb-2">{topic}:</p>
                      <div className="flex flex-wrap gap-2">
                        {subTopics.map(subTopic => (
                          <button
                            key={`${topic}-${subTopic}`}
                            onClick={() => toggleSubTopic(subTopic)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                              selectedSubTopics.includes(subTopic)
                                ? 'bg-gradient-to-r from-coral to-pink text-white'
                                : 'bg-peach/30 text-gray-700 hover:bg-peach/50'
                            }`}
                          >
                            {subTopic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}

            {/* Question Types */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Question Types</h3>
              <div className="flex flex-wrap gap-3">
                {questionTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleQuestionType(type)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedQuestionTypes.includes(type)
                        ? 'bg-gradient-to-r from-purple to-lavender text-white'
                        : 'bg-lavender/30 text-gray-700 hover:bg-lavender/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Difficulty Level</h3>
              <div className="flex gap-3">
                {difficulties.map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 rounded-xl transition-all ${
                      difficulty === level
                        ? 'gradient-pastel text-white'
                        : 'bg-lavender/30 text-gray-700 hover:bg-lavender/50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Style */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Answer Style</h3>
              <input
                type="text"
                value={answerStyle}
                onChange={(e) => setAnswerStyle(e.target.value)}
                placeholder="e.g., detailed, concise, with examples"
                className="w-full px-4 py-3 rounded-xl border border-pink/20 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">Describe how you want answers explained</p>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateQuestions}
              disabled={loading}
              className="w-full py-4 rounded-xl gradient-pastel text-white font-semibold text-lg shadow-soft hover:shadow-glow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Questions
                </>
              )}
            </motion.button>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Selection Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Topics:</span>
                  <span className="ml-2 font-medium">{selectedTopics.length > 0 ? selectedTopics.join(', ') : 'None'}</span>
                </div>
                {selectedSubTopics.length > 0 && (
                  <div>
                    <span className="text-gray-600">Sub-Topics:</span>
                    <span className="ml-2 font-medium">{selectedSubTopics.length}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Question Types:</span>
                  <span className="ml-2 font-medium">{selectedQuestionTypes.length || 'None'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="ml-2 font-medium">{difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-600">Answer Style:</span>
                  <span className="ml-2 font-medium">{answerStyle || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Questions - Accordion Style */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-4"
          >
            <h3 className="text-2xl font-bold mb-6">Generated Questions</h3>
            <div className="space-y-3">
              {questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl card-glow border border-pink/10 overflow-hidden"
                >
                  {/* Question Header - Clickable */}
                  <button
                    onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                    className="w-full p-6 text-left hover:bg-peach/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-sm px-3 py-1 rounded-full bg-peach/30">{q.topic}</span>
                          <span className="text-sm px-3 py-1 rounded-full bg-lavender/30">{q.experienceLevel}</span>
                          {q.questionTypes && q.questionTypes.map((type) => (
                            <span key={type} className="text-sm px-3 py-1 rounded-full bg-purple/30">{type}</span>
                          ))}
                        </div>
                        <p className="text-gray-800 font-medium">
                          {index + 1}. {q.question}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedQuestion === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="text-gray-400" size={24} />
                      </motion.div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedQuestion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-pink/10"
                    >
                      <div className="p-6 space-y-4">
                        {/* Answer Section */}
                        {q.answer && (
                          <div className="p-4 bg-peach/10 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Answer:</p>
                            <div className="text-sm text-gray-600 whitespace-pre-wrap">
                              {q.answer}
                            </div>
                          </div>
                        )}

                        {/* Explanation Section - NEW */}
                        {q.explanation && (
                          <div className="p-4 bg-lavender/10 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-2">📝 Explanation:</p>
                            <div className="text-sm text-gray-600 whitespace-pre-wrap">
                              {q.explanation}
                            </div>
                          </div>
                        )}

                        {/* Code Section - NEW */}
                        {q.code && (
                          <div className="p-4 bg-blue/10 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-2">💻 Code:</p>
                            <pre className="text-sm text-gray-800 font-mono overflow-x-auto">
                              <code>{q.code}</code>
                            </pre>
                          </div>
                        )}

                        {/* Hints Section */}
                        {q.hints && (
                          <div className="p-3 bg-yellow/10 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-1">💡 Hints:</p>
                            <p className="text-sm text-gray-600">{q.hints}</p>
                          </div>
                        )}

                        {/* Sub-topics if available */}
                        {q.subTopics && q.subTopics.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-gray-500">Related topics:</span>
                            {q.subTopics.map((st, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-full bg-mint/30 text-gray-600">
                                {st}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Save Button */}
                        <div className="pt-4 border-t border-pink/10">
                          <button
                            onClick={() => saveQuestion(q)}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-coral to-pink text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Save size={18} />
                            Save to Vault
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 glass rounded-xl p-4 border border-pink/20 shadow-glow flex items-center gap-3"
        >
          <Save className="text-coral" size={20} />
          <span className="font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  )
}
