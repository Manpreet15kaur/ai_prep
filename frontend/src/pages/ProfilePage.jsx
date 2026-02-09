import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { User, Mail, BookOpen, FileText, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile')
      setStats(response.data.user)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-12">Profile</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-lavender-600 flex items-center justify-center">
                  <User className="text-white" size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{stats?.name}</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail size={16} />
                    {stats?.email}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <StatBox
                  icon={<BookOpen className="text-primary-600" size={24} />}
                  value={stats?.savedQuestionsCount || 0}
                  label="Saved Questions"
                />
                <StatBox
                  icon={<FileText className="text-lavender-600" size={24} />}
                  value={stats?.resumeAnalysesCount || 0}
                  label="Resume Analyses"
                />
              </div>
            </div>

            {/* Recent Activity */}
            {stats?.recentAnalyses && stats.recentAnalyses.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Resume Analyses</h3>
                <div className="space-y-3">
                  {stats.recentAnalyses.map((analysis) => (
                    <div key={analysis._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium">{analysis.fileName}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Calendar size={14} />
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {analysis.atsScore}
                        </div>
                        <div className="text-xs text-gray-600">ATS Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-4">Account Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Member since</span>
                  <p className="font-medium mt-1">
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Total Questions</span>
                  <p className="font-medium mt-1">{stats?.savedQuestionsCount || 0}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Analyses</span>
                  <p className="font-medium mt-1">{stats?.resumeAnalysesCount || 0}</p>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-primary-50 to-lavender-50">
              <h3 className="font-semibold mb-2">Keep Going!</h3>
              <p className="text-sm text-gray-600">
                You're making great progress on your interview preparation journey.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const StatBox = ({ icon, value, label }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  )
}

export default ProfilePage
