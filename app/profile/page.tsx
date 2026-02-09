'use client'

import { motion } from 'framer-motion'
import { User, Award, Target, TrendingUp, Calendar, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const stats = {
    readinessScore: 85,
    questionsCompleted: 127,
    studyStreak: 12,
    resumeScore: 78,
    totalHours: 24
  }

  const roleProgress = [
    { role: 'Frontend Developer', progress: 85, questions: 45 },
    { role: 'Backend Developer', progress: 60, questions: 32 },
    { role: 'Full Stack Developer', progress: 40, questions: 28 },
  ]

  const recentActivity = [
    { date: '2024-02-07', action: 'Completed 5 React questions', type: 'practice' },
    { date: '2024-02-06', action: 'Analyzed resume - Score: 78', type: 'resume' },
    { date: '2024-02-05', action: 'Generated System Design questions', type: 'generate' },
    { date: '2024-02-04', action: 'Saved 8 questions to vault', type: 'save' },
  ]

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
              <Link href="/vault" className="text-gray-600 hover:text-coral transition">My Vault</Link>
              <Link href="/resume" className="text-gray-600 hover:text-coral transition">Resume Analyzer</Link>
              <Link href="/profile" className="text-coral font-medium">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full gradient-pastel flex items-center justify-center">
              <User className="text-white" size={48} />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">Sarah Johnson</h2>
              <p className="text-gray-600">Full Stack Developer • Joined Feb 2024</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard
                icon={<Target className="text-coral" size={24} />}
                value={`${stats.readinessScore}%`}
                label="Interview Readiness"
                color="from-coral to-pink"
              />
              <StatCard
                icon={<BookOpen className="text-purple" size={24} />}
                value={stats.questionsCompleted}
                label="Questions Completed"
                color="from-purple to-lavender"
              />
              <StatCard
                icon={<Calendar className="text-mint" size={24} />}
                value={`${stats.studyStreak} days`}
                label="Study Streak"
                color="from-mint to-blue"
              />
            </div>

            {/* Progress by Role */}
            <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10">
              <h3 className="font-semibold text-xl mb-6">Preparation Progress</h3>
              <div className="space-y-6">
                {roleProgress.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.role}</span>
                      <span className="text-sm text-gray-600">{item.questions} questions</span>
                    </div>
                    <div className="relative h-3 bg-peach/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        className="absolute h-full gradient-pastel rounded-full"
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm font-medium text-coral">{item.progress}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10">
              <h3 className="font-semibold text-xl mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 bg-peach/10 rounded-xl"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'practice' ? 'bg-coral/30' :
                      activity.type === 'resume' ? 'bg-purple/30' :
                      activity.type === 'generate' ? 'bg-blue/30' :
                      'bg-mint/30'
                    }`}>
                      {activity.type === 'practice' && <Target size={18} />}
                      {activity.type === 'resume' && <Award size={18} />}
                      {activity.type === 'generate' && <TrendingUp size={18} />}
                      {activity.type === 'save' && <BookOpen size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Readiness Score */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Interview Readiness</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="#FFD4C4" strokeWidth="10" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient2)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.readinessScore / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF9999" />
                      <stop offset="100%" stopColor="#FFB6C1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-coral to-pink bg-clip-text text-transparent">
                    {stats.readinessScore}%
                  </span>
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm">You're almost ready!</p>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Study Time</span>
                  <span className="font-semibold">{stats.totalHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Resume Score</span>
                  <span className="font-semibold">{stats.resumeScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Saved Questions</span>
                  <span className="font-semibold">{stats.questionsCompleted}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 card-glow border border-pink/10">
              <h3 className="font-semibold text-lg mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow to-peach flex items-center justify-center">
                    <Award className="text-white" size={20} />
                  </div>
                  <p className="text-xs text-gray-600">First Week</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-coral to-pink flex items-center justify-center">
                    <Target className="text-white" size={20} />
                  </div>
                  <p className="text-xs text-gray-600">100 Questions</p>
                </div>
                <div className="text-center opacity-50">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                    <TrendingUp className="text-gray-400" size={20} />
                  </div>
                  <p className="text-xs text-gray-600">30 Day Streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, value, label, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl p-6 card-glow border border-pink/10"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-gray-600 text-sm">{label}</p>
    </motion.div>
  )
}
