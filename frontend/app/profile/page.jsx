'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Award, Target, TrendingUp, Calendar, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getCurrentUser } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({
    readinessScore: 0,
    questionsCompleted: 0,
    studyStreak: 0,
    resumeScore: 0,
    totalHours: 0
  })
  const [roleProgress, setRoleProgress] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const userData = await getCurrentUser()
      setUserData(userData)
      
      // Use stats from backend
      if (userData.stats) {
        setStats(userData.stats)
      }

      // Calculate role progress based on topic progress
      if (userData.stats?.topicProgress) {
        const progressByRole = calculateRoleProgress(userData.stats.topicProgress)
        setRoleProgress(progressByRole)
      }

      // Generate recent activity from saved questions
      const activity = generateRecentActivity(userData.savedQuestions || [], userData.resumeAnalyses || [])
      setRecentActivity(activity)
    } catch (error) {
      console.error('Error fetching profile:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const calculateRoleProgress = (topicProgress) => {
    const roleMap = {}
    
    // Map topics to subjects (matching dashboard subjects)
    const topicToSubject = {
      'HTML': 'Frontend Development',
      'CSS': 'Frontend Development',
      'JavaScript': 'Frontend Development',
      'React': 'Frontend Development',
      'Node.js': 'Backend Development',
      'Python': 'Backend Development',
      'Java': 'Backend Development',
      'APIs': 'Backend Development',
      'Docker': 'DevOps',
      'Kubernetes': 'DevOps',
      'CI/CD': 'DevOps',
      'Cloud': 'DevOps',
      'SQL Queries': 'DBMS',
      'Normalization': 'DBMS',
      'Transactions': 'DBMS',
      'Indexes': 'DBMS',
      'Processes': 'Operating System',
      'Memory': 'Operating System',
      'File System': 'Operating System',
      'Synchronization': 'Operating System',
      'Network Models': 'Computer Networks',
      'Protocols': 'Computer Networks',
      'IP Addressing': 'Computer Networks',
      'Routing': 'Computer Networks',
      'Common Topics': 'DSA (Data Structures & Algorithms)',
      'C++': 'DSA (Data Structures & Algorithms)',
      'AWS': 'Cloud Computing',
      'Azure': 'Cloud Computing',
      'GCP': 'Cloud Computing',
      'ML Algorithms': 'AI & ML',
      'Deep Learning': 'AI & ML',
      'NLP': 'AI & ML'
    }
    
    Object.entries(topicProgress).forEach(([topic, count]) => {
      const subject = topicToSubject[topic] || topic
      
      if (!roleMap[subject]) {
        roleMap[subject] = 0
      }
      roleMap[subject] += count
    })
    
    return Object.entries(roleMap)
      .map(([subject, questions]) => ({
        role: subject,
        questions,
        progress: Math.min(100, Math.floor((questions / 50) * 100))
      }))
      .sort((a, b) => b.questions - a.questions)
      .slice(0, 3)
  }

  const generateRecentActivity = (questions, resumeAnalyses) => {
    const activities = []
    
    // Add recent saved questions
    const recentQuestions = questions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
    
    recentQuestions.forEach(q => {
      activities.push({
        date: new Date(q.createdAt).toLocaleDateString(),
        action: `Saved ${q.topic || 'question'} to vault`,
        type: 'save'
      })
    })
    
    // Add recent resume analyses
    const recentResumes = resumeAnalyses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2)
    
    recentResumes.forEach(r => {
      activities.push({
        date: new Date(r.createdAt).toLocaleDateString(),
        action: `Analyzed resume (Score: ${r.atsScore})`,
        type: 'resume'
      })
    })
    
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cream via-peach/10 to-lavender/20 flex flex-col">
        <Navbar />

        <main className="w-full max-w-[1400px] mx-auto px-6 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-full gradient-pastel flex items-center justify-center">
              <User className="text-white" size={48} />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-2">{userData.name}</h2>
              <p className="text-gray-600">
                {userData.email} • Member since {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
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
              {roleProgress.length > 0 ? (
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
              ) : (
                <p className="text-gray-500 text-center py-8">No progress yet. Start saving questions to track your progress!</p>
              )}
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl p-8 card-glow border border-pink/10">
              <h3 className="font-semibold text-xl mb-6">Recent Activity</h3>
              {recentActivity.length > 0 ? (
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
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity. Start your interview preparation journey!</p>
              )}
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
              <p className="text-center text-gray-600 text-sm">
                {stats.readinessScore >= 80 ? "You're interview ready!" : 
                 stats.readinessScore >= 50 ? "Keep going, you're making progress!" :
                 stats.readinessScore > 0 ? "Just getting started!" :
                 "Start saving questions to track readiness"}
              </p>
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
                <div className={`text-center ${stats.questionsCompleted >= 1 ? '' : 'opacity-50'}`}>
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${stats.questionsCompleted >= 1 ? 'bg-gradient-to-br from-yellow to-peach' : 'bg-gray-200'} flex items-center justify-center`}>
                    <Award className={stats.questionsCompleted >= 1 ? 'text-white' : 'text-gray-400'} size={20} />
                  </div>
                  <p className="text-xs text-gray-600">First Save</p>
                </div>
                <div className={`text-center ${stats.questionsCompleted >= 50 ? '' : 'opacity-50'}`}>
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${stats.questionsCompleted >= 50 ? 'bg-gradient-to-br from-coral to-pink' : 'bg-gray-200'} flex items-center justify-center`}>
                    <Target className={stats.questionsCompleted >= 50 ? 'text-white' : 'text-gray-400'} size={20} />
                  </div>
                  <p className="text-xs text-gray-600">50 Questions</p>
                </div>
                <div className={`text-center ${stats.studyStreak >= 7 ? '' : 'opacity-50'}`}>
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${stats.studyStreak >= 7 ? 'bg-gradient-to-br from-purple to-lavender' : 'bg-gray-200'} flex items-center justify-center`}>
                    <TrendingUp className={stats.studyStreak >= 7 ? 'text-white' : 'text-gray-400'} size={20} />
                  </div>
                  <p className="text-xs text-gray-600">7 Day Streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    <Footer />
    </div>
    </ProtectedRoute>
  )
}

function StatCard({ icon, value, label, color }) {
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
