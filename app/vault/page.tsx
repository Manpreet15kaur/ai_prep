'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit2, Trash2, Bookmark, Filter } from 'lucide-react'
import Link from 'next/link'

const mockQuestions = [
  { id: 1, question: 'Explain React hooks and their use cases', role: 'Frontend Developer', difficulty: 'Intermediate', topic: 'React', bookmarked: true, createdAt: '2024-02-01' },
  { id: 2, question: 'Design a RESTful API for a social media platform', role: 'Backend Developer', difficulty: 'Advanced', topic: 'System Design', bookmarked: false, createdAt: '2024-02-03' },
  { id: 3, question: 'What is the difference between SQL and NoSQL?', role: 'Full Stack Developer', difficulty: 'Beginner', topic: 'Databases', bookmarked: true, createdAt: '2024-02-05' },
]

export default function VaultPage() {
  const [questions, setQuestions] = useState(mockQuestions)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const deleteQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const toggleBookmark = (id: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, bookmarked: !q.bookmarked } : q
    ))
  }

  const startEdit = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, question: editText } : q
    ))
    setEditingId(null)
  }

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'All' || q.role === filterRole
    const matchesDifficulty = filterDifficulty === 'All' || q.difficulty === filterDifficulty
    return matchesSearch && matchesRole && matchesDifficulty
  })

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
              <Link href="/vault" className="text-coral font-medium">My Vault</Link>
              <Link href="/resume" className="text-gray-600 hover:text-coral transition">Resume Analyzer</Link>
              <Link href="/profile" className="text-gray-600 hover:text-coral transition">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">My Interview Vault</h2>
              <p className="text-gray-600">{questions.length} questions saved</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl gradient-pastel text-white font-medium flex items-center gap-2 shadow-soft hover:shadow-glow transition-all"
            >
              <Plus size={20} />
              Create Custom Question
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
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
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all"
          >
            <option>All Roles</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
          </select>
          
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all"
          >
            <option>All Difficulties</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
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
    </div>
  )
}
