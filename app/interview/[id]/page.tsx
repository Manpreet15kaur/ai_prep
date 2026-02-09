'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Save, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const topics = ['DSA', 'System Design', 'DevOps', 'UI/UX', 'Machine Learning', 'Cloud', 'APIs', 'Databases']
const difficulties = ['Beginner', 'Intermediate', 'Advanced']
const techStacks = ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL']

export default function InterviewGeneratorPage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  const toggleTech = (tech: string) => {
    setSelectedTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    )
  }

  const generateQuestions = () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic')
      return
    }
    
    setLoading(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const mockQuestions = [
        { id: 1, question: 'Explain the difference between let, const, and var in JavaScript', difficulty: difficulty, topic: selectedTopics[0] },
        { id: 2, question: 'How would you optimize a React application for performance?', difficulty: difficulty, topic: selectedTopics[0] },
        { id: 3, question: 'Design a scalable microservices architecture for an e-commerce platform', difficulty: difficulty, topic: selectedTopics[0] },
        { id: 4, question: 'What are the key principles of RESTful API design?', difficulty: difficulty, topic: selectedTopics[0] },
        { id: 5, question: 'Explain the concept of closures in JavaScript with examples', difficulty: difficulty, topic: selectedTopics[0] },
      ]
      setQuestions(mockQuestions)
      setLoading(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }, 2000)
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
            {/* Topics */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Select Topics</h3>
              <div className="flex flex-wrap gap-3">
                {topics.map(topic => (
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

            {/* Tech Stack */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-3">
                {techStacks.map(tech => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedTech.includes(tech)
                        ? 'bg-gradient-to-r from-blue to-lavender text-white'
                        : 'bg-blue/30 text-gray-700 hover:bg-blue/50'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
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
                  <span className="ml-2 font-medium">{selectedTopics.length || 'None'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="ml-2 font-medium">{difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tech Stack:</span>
                  <span className="ml-2 font-medium">{selectedTech.length || 'None'}</span>
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
            className="mt-12 space-y-4"
          >
            <h3 className="text-2xl font-bold mb-6">Generated Questions</h3>
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 card-glow border border-pink/10"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm px-3 py-1 rounded-full bg-peach/30">{q.topic}</span>
                  <span className="text-sm px-3 py-1 rounded-full bg-lavender/30">{q.difficulty}</span>
                </div>
                <p className="text-gray-800 font-medium">{q.question}</p>
              </motion.div>
            ))}
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
          <span className="font-medium">Saved to My Interview Vault</span>
        </motion.div>
      )}
    </div>
  )
}
