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
      <div className="min-h-screen bg-gradient-to-br from-purple/30 via-pink/40 to-coral/30 flex flex-col relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-electric-violet/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-coral-vibrant/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lavender/15 rounded-full blur-3xl"></div>
        </div>
        
        <Navbar />

        {/* Main Content */}
        <main className="w-full max-w-[1400px] mx-auto px-6 py-12 flex-1 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl font-display font-bold mb-3 bg-gradient-to-r from-coral-vibrant via-electric-violet to-pink bg-clip-text text-transparent">
              Choose Your Role
            </h2>
            <p className="text-gray-700 text-lg mb-12">Select a role to start your interview preparation journey</p>
          </motion.div>

          {/* Equal Size Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Link href={`/interview/${role.id}`}>
        <div className="relative card-bento rounded-3xl p-6 cursor-pointer h-[220px] flex flex-col overflow-hidden group">
          {/* Background icon in TOP RIGHT corner */}
          <div className="absolute -top-4 -right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
            <Icon size={120} />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow">
              <Icon className="text-white" size={24} />
            </div>
            
            <h3 className="text-lg font-display font-bold mb-3 text-gray-800 leading-tight">
              {role.title}
            </h3>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              {role.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="px-2.5 py-1 rounded-full bg-white/70 text-xs font-semibold text-gray-700 border border-white/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-electric-violet/0 to-coral-vibrant/0 group-hover:from-electric-violet/5 group-hover:to-coral-vibrant/5 transition-all duration-500 rounded-3xl pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  )
}
