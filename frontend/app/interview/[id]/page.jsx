'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, Loader2, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

const topicsData = {
  1: { // Frontend Development
    title: 'Frontend Development',
    color: 'from-peach to-coral',
    topics: {
      'HTML': ['Basics & Structure', 'Elements & Attributes', 'Forms & Validation', 'Semantic HTML', 'Media (Audio, Video)', 'Canvas & SVG', 'HTML5 APIs', 'Geolocation', 'LocalStorage / SessionStorage', 'Web Workers'],
      'CSS': ['Selectors & Specificity', 'Box Model', 'Flexbox', 'Grid', 'Positioning', 'Responsive Design', 'Media Queries', 'Animations & Transitions', 'Preprocessors (SASS basics)'],
      'JavaScript': ['Variables & Data Types', 'Scope & Hoisting', 'Functions & Arrow Functions', 'DOM Manipulation', 'Events & Event Bubbling', 'ES6+ Features', 'Promises', 'Async / Await', 'Error Handling', 'Closures', 'Debouncing / Throttling'],
      'React': ['JSX', 'Components (Functional vs Class)', 'Props & State', 'Hooks', 'useState', 'useEffect', 'useContext', 'Conditional Rendering', 'Lists & Keys', 'Routing (React Router)', 'API Integration', 'Performance Optimization']
    }
  },
  2: { // Backend Development
    title: 'Backend Development',
    color: 'from-lavender to-purple',
    topics: {
      'Node.js': ['Node Architecture', 'Event Loop', 'Express.js', 'Routing', 'Middleware', 'REST APIs', 'Authentication', 'JWT', 'Sessions', 'Validation', 'Error Handling', 'MongoDB Integration', 'Security (CORS, Rate Limiting)'],
      'Python': ['Core Python', 'Virtual Environments', 'Django', 'Models', 'Views', 'Templates', 'ORM', 'Authentication', 'Flask', 'Blueprints', 'REST APIs', 'API Validation', 'Error Handling'],
      'Java': ['Core Java', 'OOP Concepts', 'Spring Boot', 'Controllers', 'Services', 'Repositories', 'REST APIs', 'JPA / Hibernate', 'JDBC', 'Authentication & Authorization'],
      'APIs': ['REST Principles', 'HTTP Methods', 'Status Codes', 'Authentication', 'Pagination', 'Versioning', 'GraphQL Basics']
    }
  },
  3: { // DevOps
    title: 'DevOps',
    color: 'from-blue to-lavender',
    topics: {
      'Docker': ['Containers vs VM', 'Docker Images', 'Dockerfile', 'Volumes', 'Networking', 'Docker Compose'],
      'Kubernetes': ['Architecture', 'Pods', 'Deployments', 'Services', 'ConfigMaps', 'Secrets', 'Scaling'],
      'CI/CD': ['CI vs CD', 'Jenkins', 'GitHub Actions', 'Pipelines', 'Automated Testing', 'Deployment Strategies'],
      'Cloud': ['Compute', 'Storage', 'Networking', 'Monitoring']
    }
  },
  4: { // DBMS
    title: 'DBMS',
    color: 'from-mint to-blue',
    topics: {
      'SQL Queries': ['SELECT', 'WHERE', 'JOIN (INNER, LEFT, RIGHT)', 'GROUP BY', 'HAVING', 'Subqueries'],
      'Normalization': ['1NF', '2NF', '3NF', 'BCNF', 'Denormalization'],
      'Transactions': ['ACID Properties', 'Commit / Rollback', 'Isolation Levels', 'Locks'],
      'Indexes': ['Clustered', 'Non-Clustered', 'Composite', 'Performance Impact']
    }
  },
  5: { // Operating System
    title: 'Operating System',
    color: 'from-yellow to-peach',
    topics: {
      'Processes': ['Process States', 'Context Switching', 'Threads', 'CPU Scheduling Algorithms'],
      'Memory': ['Paging', 'Segmentation', 'Virtual Memory', 'Page Replacement Algorithms'],
      'File System': ['File Types', 'Directory Structure', 'File Allocation', 'Permissions'],
      'Synchronization': ['Critical Section', 'Mutex', 'Semaphore', 'Deadlocks', 'Starvation']
    }
  },
  6: { // Computer Networks
    title: 'Computer Networks',
    color: 'from-pink to-coral',
    topics: {
      'Network Models': ['OSI Model', 'TCP/IP Model', 'Layer Functions'],
      'Protocols': ['HTTP / HTTPS', 'TCP / UDP', 'FTP', 'SMTP', 'DNS'],
      'IP Addressing': ['IPv4', 'IPv6', 'Subnetting', 'NAT'],
      'Routing': ['Static Routing', 'Dynamic Routing', 'RIP', 'OSPF']
    }
  },
  7: { // DSA
    title: 'DSA (Data Structures & Algorithms)',
    color: 'from-purple to-pink',
    topics: {
      'Common Topics': ['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs', 'Searching', 'Sorting', 'Recursion', 'Time & Space Complexity'],
      'C++': ['STL', 'Vectors', 'Maps', 'Sets', 'Algorithms'],
      'Java': ['Collections Framework', 'ArrayList', 'HashMap', 'TreeSet'],
      'Python': ['Lists', 'Dictionaries', 'Sets', 'Tuples']
    }
  },
  8: { // Cloud Computing
    title: 'Cloud Computing',
    color: 'from-coral to-lavender',
    topics: {
      'AWS': ['EC2', 'S3', 'Lambda', 'RDS', 'IAM', 'CloudWatch'],
      'Azure': ['Virtual Machines', 'Blob Storage', 'Functions', 'SQL Database'],
      'GCP': ['Compute Engine', 'Cloud Storage', 'Cloud Functions', 'BigQuery'],
      'DevOps Integration': ['CI/CD on Cloud', 'Container Deployment', 'Monitoring & Logging']
    }
  },
  9: { // AI & ML
    title: 'AI & ML',
    color: 'from-beige to-peach',
    topics: {
      'Python': ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
      'ML Algorithms': ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'KNN', 'SVM'],
      'Deep Learning': ['Neural Networks', 'CNN', 'RNN', 'TensorFlow', 'PyTorch'],
      'NLP': ['Tokenization', 'Text Cleaning', 'Bag of Words', 'Word Embeddings', 'Transformers', 'Sentiment Analysis']
    }
  }
}

export default function InterviewPage() {
  const params = useParams()
  const id = parseInt(params.id)
  const data = topicsData[id]

  const [expandedTopics, setExpandedTopics] = useState({})
  const [selectedSubtopics, setSelectedSubtopics] = useState({})
  const [questionType, setQuestionType] = useState('MCQ')
  const [generatedQuestions, setGeneratedQuestions] = useState([])
  const [expandedAnswers, setExpandedAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [savedQuestions, setSavedQuestions] = useState({})
  const [savingQuestion, setSavingQuestion] = useState(null)

  if (!data) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Topic not found</h2>
            <Link href="/dashboard">
              <button className="px-6 py-3 rounded-xl gradient-pastel text-white font-semibold">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const toggleTopic = (topic) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }))
  }

  const toggleSubtopic = (topic, subtopic) => {
    setSelectedSubtopics(prev => {
      const current = prev[topic] || []
      if (current.includes(subtopic)) {
        return {
          ...prev,
          [topic]: current.filter(s => s !== subtopic)
        }
      } else {
        return {
          ...prev,
          [topic]: [...current, subtopic]
        }
      }
    })
  }

  const toggleAnswer = (index) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleGenerateQuestions = async () => {
    const selected = Object.entries(selectedSubtopics).filter(([_, subtopics]) => subtopics.length > 0)
    
    if (selected.length === 0) {
      alert('Please select at least one subtopic')
      return
    }

    setLoading(true)
    setGeneratedQuestions([])
    setSavedQuestions({})
    setExpandedAnswers({})

    await generateQuestions(selected)
  }

  const handleGenerateMore = async () => {
    const selected = Object.entries(selectedSubtopics).filter(([_, subtopics]) => subtopics.length > 0)
    
    if (selected.length === 0) {
      alert('Please select at least one subtopic')
      return
    }

    setLoading(true)

    await generateQuestions(selected)
  }

  const generateQuestions = async (selected) => {
    try {
      // Prepare topics and subtopics for API
      const topics = selected.map(([topic]) => topic)
      const allSubtopics = selected.flatMap(([_, subtopics]) => subtopics)

      const response = await fetch('http://localhost:5000/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topics,
          subTopics: allSubtopics,
          experienceLevel: 'Mid-Level',
          questionTypes: [questionType === 'MCQ' ? 'MCQ' : 'Conceptual'],
          count: questionType === 'MCQ' ? 10 : 5
        })
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedQuestions(prev => [...prev, ...result.questions])
      } else {
        alert('Failed to generate questions: ' + result.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to generate questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveQuestion = async (question, index) => {
    setSavingQuestion(index)

    try {
      const response = await fetch('http://localhost:5000/api/questions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topic: data.title,
          experienceLevel: 'Mid-Level',
          questionTypes: [questionType === 'MCQ' ? 'MCQ' : 'Conceptual'],
          question: question.question,
          answer: question.answer,
          hints: question.hints || '',
          subTopics: question.subTopics || [],
          programmingLanguage: question.programmingLanguage || null,
          // Store MCQ options if available
          optionA: question.optionA || '',
          optionB: question.optionB || '',
          optionC: question.optionC || '',
          optionD: question.optionD || '',
          explanation: question.explanation || ''
        })
      })

      const result = await response.json()

      if (result.success) {
        setSavedQuestions(prev => ({ ...prev, [index]: true }))
        // Show success message
        setTimeout(() => {
          setSavedQuestions(prev => ({ ...prev, [index]: 'saved' }))
        }, 1000)
      } else {
        console.error('Save failed:', result)
        alert('Failed to save question: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to save question. Please try again.')
    } finally {
      setSavingQuestion(null)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/dashboard">
              <button className="flex items-center gap-2 text-gray-600 hover:text-coral transition mb-4">
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
            </Link>
            
            <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-br ${data.color} mb-4`}>
              <h1 className="text-3xl font-bold text-white">{data.title}</h1>
            </div>
            
            <p className="text-gray-600 text-lg">Select subtopics and question type to generate questions</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Topics Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Select Topics</h3>
                
                {/* Collapsible Topics */}
                <div className="space-y-2 mb-6">
                  {Object.entries(data.topics).map(([topic, subtopics]) => (
                    <div key={topic} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleTopic(topic)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <span className="font-semibold text-sm">{topic}</span>
                        {expandedTopics[topic] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedTopics[topic] && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-1 bg-white">
                              {subtopics.map((subtopic) => {
                                const isSelected = selectedSubtopics[topic]?.includes(subtopic)
                                return (
                                  <button
                                    key={subtopic}
                                    onClick={() => toggleSubtopic(topic, subtopic)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center gap-2 ${
                                      isSelected
                                        ? 'bg-coral/10 text-coral font-medium'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                  >
                                    {isSelected && <CheckCircle2 size={14} />}
                                    {subtopic}
                                  </button>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Question Type Selection */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm">Question Type</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setQuestionType('MCQ')}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition ${
                        questionType === 'MCQ'
                          ? 'bg-gradient-to-r from-coral to-pink text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      MCQs (10 questions)
                    </button>
                    <button
                      onClick={() => setQuestionType('Conceptual')}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition ${
                        questionType === 'Conceptual'
                          ? 'bg-gradient-to-r from-coral to-pink text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Conceptual (5 questions)
                    </button>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateQuestions}
                  disabled={loading}
                  className="w-full py-3 rounded-xl gradient-pastel text-white font-semibold shadow-soft hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Generating...
                    </>
                  ) : (
                    'Generate Questions'
                  )}
                </button>
              </div>
            </div>

            {/* Right Panel - Generated Questions */}
            <div className="lg:col-span-2">
              {generatedQuestions.length === 0 && !loading && (
                <div className="bg-white rounded-2xl p-12 card-glow border border-pink/10 text-center">
                  <p className="text-gray-500">Select topics and click "Generate Questions" to start</p>
                </div>
              )}

              {loading && (
                <div className="bg-white rounded-2xl p-12 card-glow border border-pink/10 text-center">
                  <Loader2 className="animate-spin mx-auto mb-4 text-coral" size={40} />
                  <p className="text-gray-600">Generating {questionType === 'MCQ' ? '10 MCQs' : '5 Conceptual Questions'}...</p>
                </div>
              )}

              {generatedQuestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4">
                    {questionType === 'MCQ' ? 'Multiple Choice Questions' : 'Conceptual Questions'}
                  </h3>
                  
                  {generatedQuestions.map((q, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-coral to-pink text-white flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{q.question}</p>
                        </div>
                        
                        {/* Save Button */}
                        <button
                          onClick={() => handleSaveQuestion(q, index)}
                          disabled={savingQuestion === index || savedQuestions[index]}
                          className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                            savedQuestions[index] === 'saved'
                              ? 'bg-green-100 text-green-600'
                              : savedQuestions[index]
                              ? 'bg-coral/20 text-coral'
                              : 'bg-gray-100 text-gray-600 hover:bg-coral/20 hover:text-coral'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={savedQuestions[index] ? 'Saved to vault' : 'Save to vault'}
                        >
                          {savingQuestion === index ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Bookmark 
                              size={18} 
                              fill={savedQuestions[index] ? 'currentColor' : 'none'}
                            />
                          )}
                        </button>
                      </div>

                      {/* MCQ Options */}
                      {questionType === 'MCQ' && q.optionA && (
                        <div className="ml-11 space-y-2 mb-4">
                          {['A', 'B', 'C', 'D'].map((letter) => {
                            const option = q[`option${letter}`]
                            const isCorrect = q.answer === letter
                            return (
                              <div
                                key={letter}
                                className={`p-3 rounded-lg border-2 ${
                                  expandedAnswers[index] && isCorrect
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                <span className="font-semibold">{letter})</span> {option}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Show Answer Button */}
                      <div className="ml-11">
                        <button
                          onClick={() => toggleAnswer(index)}
                          className="flex items-center gap-2 text-coral hover:text-pink transition font-medium text-sm"
                        >
                          {expandedAnswers[index] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          {expandedAnswers[index] ? 'Hide Answer' : 'Show Answer'}
                        </button>

                        <AnimatePresence>
                          {expandedAnswers[index] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200"
                            >
                              {questionType === 'MCQ' && (
                                <p className="font-semibold text-green-700 mb-2">
                                  Correct Answer: {q.answer}
                                </p>
                              )}
                              <p className="text-gray-700 text-sm">{q.explanation}</p>
                              {q.code && (
                                <pre className="mt-3 p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
                                  <code>{q.code}</code>
                                </pre>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}

                  {/* Generate More Questions Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleGenerateMore}
                      disabled={loading}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-lavender to-purple text-white font-semibold shadow-soft hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Generating More...
                        </>
                      ) : (
                        <>
                          Generate More Questions
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
