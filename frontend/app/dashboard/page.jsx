'use client'

import { motion } from 'framer-motion'
import { Code, Server, Cog, Database as DatabaseIcon, Cpu, Network, Binary, Cloud as CloudIcon, Brain } from 'lucide-react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const roles = [
  { 
    id: 1, 
    title: 'Frontend Development', 
    icon: Code, 
    color: 'from-peach to-coral', 
    skills: ['HTML', 'CSS', 'React', 'JavaScript']
  },
  { 
    id: 2, 
    title: 'Backend Development', 
    icon: Server, 
    color: 'from-lavender to-purple', 
    skills: ['Node.js', 'Python', 'Java', 'APIs']
  },
  { 
    id: 3, 
    title: 'DevOps', 
    icon: Cog, 
    color: 'from-blue to-lavender', 
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud']
  },
  { 
    id: 4, 
    title: 'DBMS', 
    icon: DatabaseIcon, 
    color: 'from-mint to-blue', 
    skills: ['SQL Queries', 'Normalization', 'Transactions', 'Indexes']
  },
  { 
    id: 5, 
    title: 'Operating System', 
    icon: Cpu, 
    color: 'from-yellow to-peach', 
    skills: ['Processes', 'Memory', 'File System', 'Synchronization']
  },
  { 
    id: 6, 
    title: 'Computer Networks', 
    icon: Network, 
    color: 'from-pink to-coral', 
    skills: ['Models', 'Protocols', 'IP Addressing', 'Routing']
  },
  { 
    id: 7, 
    title: 'DSA', 
    icon: Binary, 
    color: 'from-purple to-pink', 
    skills: ['C++', 'Java', 'Python']
  },
  { 
    id: 8, 
    title: 'Cloud Computing', 
    icon: CloudIcon, 
    color: 'from-coral to-lavender', 
    skills: ['AWS', 'Azure', 'GCP', 'DevOps Integration']
  },
  { 
    id: 9, 
    title: 'AI & ML', 
    icon: Brain, 
    color: 'from-beige to-peach', 
    skills: ['Python', 'ML Algorithms', 'Deep Learning', 'NLP']
  },
]

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20 flex flex-col">
        <Navbar />

        {/* Main Content */}
        <main className="w-full max-w-[1400px] mx-auto px-6 py-12 flex-1">
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

        <Footer />
      </div>
    </ProtectedRoute>
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
        </div>
      </Link>
    </motion.div>
  )
}
