'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Brain, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-peach/20 to-lavender/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass z-50 border-b border-pink/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="text-coral" size={24} />
            <span className="text-xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
              Interview Prep AI
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <Link href="/login">
              <button className="px-6 py-2 rounded-full text-gray-700 hover:bg-white/50 transition-all">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2 rounded-full gradient-pastel text-white font-medium hover:shadow-glow transition-all">
                Sign Up
              </button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 rounded-full glass border border-pink/30 text-sm font-medium text-coral">
                ✨ AI Powered
              </span>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-coral via-purple to-pink bg-clip-text text-transparent">
                Ace Interviews
              </span>
              <br />
              <span className="text-gray-800">with AI-Powered Learning</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              From preparation to mastery — your ultimate interview toolkit
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard">
                <button className="px-8 py-4 rounded-full gradient-pastel text-white font-semibold text-lg shadow-soft hover:shadow-glow transition-all flex items-center gap-2 mx-auto">
                  Get Started
                  <ArrowRight size={20} />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 glass rounded-3xl p-8 max-w-4xl mx-auto border border-pink/20 card-glow"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Brain className="text-coral" size={32} />}
                title="AI Interview Generator"
                description="Role-based questions tailored to your career"
              />
              <FeatureCard
                icon={<Target className="text-purple" size={32} />}
                title="ATS Resume Analyzer"
                description="Get instant feedback and optimization tips"
              />
              <FeatureCard
                icon={<TrendingUp className="text-pink" size={32} />}
                title="Track Progress"
                description="Monitor your preparation journey"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="text-center"
    >
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  )
}
