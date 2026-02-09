import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Search, Edit2, Trash2, BookOpen } from 'lucide-react'

const SavedQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    const filtered = questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredQuestions(filtered)
  }, [searchQuery, questions])

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions')
      setQuestions(response.data.questions)
      setFilteredQuestions(response.data.questions)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuestion = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      await axios.delete(`/api/questions/${id}`)
      setQuestions(prev => prev.filter(q => q._id !== id))
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/questions/${id}`, { question: editText })
      setQuestions(prev => prev.map(q =>
        q._id === id ? { ...q, question: editText } : q
      ))
      setEditingId(null)
    } catch (error) {
      console.error('Error updating question:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">My Questions</h1>
              <p className="text-gray-600">{questions.length} questions saved</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold mb-2">No questions found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try a different search term' : 'Start generating questions to build your collection'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, index) => (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="badge bg-primary-100 text-primary-700">{q.topic}</span>
                    <span className="badge bg-lavender-100 text-lavender-700">{q.experienceLevel}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(q._id, q.question)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteQuestion(q._id)}
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {editingId === q._id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="input-field"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(q._id)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-lavender-600 text-white font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg mb-3">{q.question}</h3>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Answer:</h4>
                      <p className="text-gray-700">{q.answer}</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                      <span>Added {new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default SavedQuestions
