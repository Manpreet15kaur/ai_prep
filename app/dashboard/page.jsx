'use client'

import { motion } from 'framer-motion'
import { Code, Database, Layers, BarChart, Cloud, Palette, Smartphone, Brain, Briefcase } from 'lucide-react'
import Link from 'next/link'

const roles = [
  { id: 1, title: 'Frontend Developer', icon: Code, color: 'from-peach to-coral', skills: ['React', 'TypeScript', 'CSS'], experience: 'Mid-Level', questions: 45 },
  { id: 2, title: 'Backend Developer', icon: Database, color: 'from-lavender to-purple', skills: ['Node.js', 'SQL', 'APIs'], experience: 'Senior', questions: 52 },
  { id: 3, title: 'Full Stack Developer', icon: Layers, color: 'from-blue to-lavender', skills: ['MERN', 'DevOps', 'AWS'], experience: 'Mid-Level', questions: 68 },
  { id: 4, title: 'Data Analyst', icon: BarChart, color: 'from-mint to-blue', skills: ['Python', 'SQL', 'Tableau'], experience: 'Entry', questions: 38 },
  { id: 5, title: 'DevOps Engineer', icon: Cloud, color: 'from-yellow to-peach', skills: ['Docker', 'K8s', 'CI/CD'], experience: 'Senior', questions: 41 },
  { id: 6, title: 'UI/UX Designer', icon: Palette, color: 'from-pink to-coral', skills: ['Figma', 'Design Systems'], experience: 'Mid-Level', questions: 33 },
  { id: 7, title: 'Mobile App Developer', icon: Smartphone, color: 'from-purple to-pink', skills: ['React Native', 'Swift'], experience: 'Mid-Level', questions: 47 },
  { id: 8, title: 'AI/ML Engineer', icon: Brain, color: 'from-coral to-lavender', skills: ['Python', 'TensorFlow', 'ML'], experience: 'Senior', questions: 55 },
  { id: 9, title: 'Product Manager', icon: Briefcase, color: 'from-beige to-peach', skills: ['Strategy', 'Analytics', 'Agile'], experience: 'Senior', questions: 42 },
]

export default function DashboardPage() {
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
              <Link href="/dashboard" className="text-coral font-medium">Dashboard</Link>
              <Link href="/vault" className="text-gray-600 hover:text-coral transition">My Vault</Link>
              <Link href="/resume" className="text-gray-600 hover:text-coral transition">Resume Analyzer</Link>
              <Link href="/profile" className="text-gray-600 hover:text-coral transition">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold mb-3">Choose Your Role</h2>
          <p className="text-gray-600 mb-12">Select a role to start your interview preparation journey</p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <RoleCard key={role.id} role={role} index={index} />
          ))}
        </div>
      </main>
    </div>
  )
}

function RoleCard({ role, index }) {
  const Icon = role.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/interview/${role.id}`}>
        <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10 cursor-pointer h-full">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
            <Icon className="text-white" size={28} />
          </div>
          
          <h3 className="text-xl font-bold mb-3">{role.title}</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {role.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full bg-peach/30 text-xs font-medium text-gray-700">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-lavender/30">{role.experience}</span>
            <span className="font-medium">{role.questions} Q&A</span>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            Last updated: 2 days ago
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
