'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Edit2, Trash2, Bookmark } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function VaultPage() {
  const [questions, setQuestions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

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

  const deleteQuestion = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setQuestions(questions.filter(q => q._id !== id))
      } else {
        alert('Failed to delete question')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete question')
    }
  }

  const toggleBookmark = (id) => {
    // Bookmark functionality can be added later
    console.log('Toggle bookmark:', id)
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20 flex flex-col">
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
        <div className="grid md:grid-cols-3 gap-4 mb-8">
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
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all"
          >
            <option>All</option>
            <option>Frontend Development</option>
            <option>Backend Development</option>
            <option>DevOps</option>
            <option>DBMS</option>
            <option>Operating System</option>
            <option>Computer Networks</option>
            <option>DSA (Data Structures & Algorithms)</option>
            <option>Cloud Computing</option>
            <option>AI & ML</option>
          </select>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 card-glow border border-pink/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-peach/30 text-xs font-medium">{q.topic}</span>
                  <span className="px-3 py-1 rounded-full bg-lavender/30 text-xs font-medium">{q.difficulty}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className={`p-2 rounded-lg transition-all ${
                      q.bookmarked ? 'bg-yellow/30 text-coral' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark size={18} fill={q.bookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => startEdit(q.id, q.question)}
                    className="p-2 rounded-lg bg-blue/20 text-blue hover:bg-blue/30 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="p-2 rounded-lg bg-coral/20 text-coral hover:bg-coral/30 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {editingId === q.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-3 rounded-lg border border-pink/20 focus:outline-none focus:border-coral"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(q.id)}
                      className="px-4 py-2 rounded-lg gradient-pastel text-white font-medium"
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
                  <p className="text-gray-800 font-medium mb-3">{q.question}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{q.role}</span>
                    <span>Added {q.createdAt}</span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
    </ProtectedRoute>
  )
}
