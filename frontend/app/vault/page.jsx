'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Edit2, Trash2, AlertTriangle, X } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function VaultPage() {
  const [questions, setQuestions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    loadSavedQuestions()
  }, [])

  const loadSavedQuestions = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      const response = await fetch(`${API_URL}/questions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setQuestions(result.questions)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
    }
  }

  const confirmDelete = (id) => {
    console.log('Confirm delete called with ID:', id)
    setDeleteConfirm(id)
  }

  const deleteQuestion = async (id) => {
    console.log('Delete question called with ID:', id)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const url = `${API_URL}/questions/${id}`
      console.log('DELETE request to:', url)

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()
      console.log('Delete response:', result)

      if (result.success) {
        setQuestions(questions.filter(q => q._id !== id))
        setDeleteConfirm(null)
      } else {
        console.error('Delete failed:', result.message)
        alert('Failed to delete question: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Failed to delete question: ' + error.message)
    }
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = async (id) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ question: editText })
      })

      const result = await response.json()

      if (result.success) {
        setQuestions(questions.map(q => 
          q._id === id ? { ...q, question: editText } : q
        ))
        setEditingId(null)
      } else {
        alert('Failed to update question')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update question')
    }
  }

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = filterSubject === 'All' || q.topic === filterSubject
    return matchesSearch && matchesSubject
  })

  // Get unique topics from saved questions
  const availableTopics = ['All', ...new Set(questions.map(q => q.topic))]
  
  console.log('Available topics:', availableTopics)
  console.log('Current filter:', filterSubject)
  console.log('Total questions:', questions.length)
  console.log('Filtered questions:', filteredQuestions.length)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple/30 via-pink/40 to-coral/30 flex flex-col relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-electric-violet/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-coral-vibrant/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lavender/15 rounded-full blur-3xl"></div>
        </div>
        
        <Navbar />

        <main className="w-full max-w-[1400px] mx-auto px-6 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">My Interview Vault</h2>
              <p className="text-gray-600">{questions.length} questions saved</p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 relative z-10">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all"
            />
          </div>
          
          <select
            value={filterSubject}
            onChange={(e) => {
              console.log('Filter changed to:', e.target.value)
              setFilterSubject(e.target.value)
            }}
            className="px-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all cursor-pointer relative z-20"
          >
            {availableTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Questions List */}
        <div className="space-y-4 relative z-10">
          {filteredQuestions.map((q, index) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 card-glow border border-pink/10 relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-peach/30 text-xs font-medium">{q.topic}</span>
                  <span className="px-3 py-1 rounded-full bg-lavender/30 text-xs font-medium">{q.experienceLevel}</span>
                </div>
                
                <div className="flex gap-2 relative z-20">
                  <button
                    onClick={() => {
                      console.log('Edit clicked for:', q._id)
                      startEdit(q._id, q.question)
                    }}
                    className="p-2 rounded-lg bg-blue/20 text-blue hover:bg-blue/30 transition-all cursor-pointer"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Delete clicked for:', q._id)
                      confirmDelete(q._id)
                    }}
                    className="p-2 rounded-lg bg-coral/20 text-coral hover:bg-coral/30 transition-all cursor-pointer"
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
                    className="w-full p-3 rounded-lg border border-pink/20 focus:outline-none focus:border-coral"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(q._id)}
                      className="px-4 py-2 rounded-lg gradient-pastel text-white font-medium hover:brightness-90 active:brightness-75 active:scale-[0.98] transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 active:scale-[0.98] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 font-medium mb-3">{q.question}</p>
                  <div className="flex justify-end items-center text-sm text-gray-500">
                    <span>Added {new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Modal - Small and Compact */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />

            {/* Modal */}
            <div className="fixed top-0 left-0 right-0 z-[101] flex justify-center pt-32 px-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="w-full max-w-sm pointer-events-auto"
              >
                <div className="bg-white rounded-2xl p-5 shadow-2xl border border-pink/20 relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={16} />
                  </button>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-center mb-1">Delete Question?</h3>
                  <p className="text-gray-600 text-center text-sm mb-4">
                    This action cannot be undone.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 active:bg-gray-300 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteQuestion(deleteConfirm)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:brightness-90 active:brightness-75 transition shadow-sm text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
    </ProtectedRoute>
  )
}
