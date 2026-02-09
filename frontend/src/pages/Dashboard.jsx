import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Sparkles, BookOpen, FileText, TrendingUp, ArrowRight } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/user/profile')
      setStats(response.data.user)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Welcome back, {stats?.name}!
          </h1>
          <p className="text-gray-600 mb-12">Continue your interview preparation journey</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<BookOpen className="text-primary-600" size={28} />}
            value={stats?.savedQuestionsCount || 0}
            label="Saved Questions"
            color="from-primary-500 to-primary-600"
          />
          <StatCard
            icon={<FileText className="text-lavender-600" size={28} />}
            value={stats?.resumeAnalysesCount || 0}
            label="Resume Analyses"
            color="from-lavender-500 to-lavender-600"
          />
          <StatCard
            icon={<TrendingUp className="text-primary-600" size={28} />}
            value="Ready"
            label="Interview Status"
            color="from-primary-500 to-lavender-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <ActionCard
            icon={<Sparkles className="text-primary-600" size={32} />}
            title="Generate Questions"
            description="Create AI-powered interview questions based on your preferences"
            link="/generate"
            gradient="from-primary-50 to-lavender-50"
          />
          <ActionCard
            icon={<FileText className="text-lavender-600" size={32} />}
            title="Analyze Resume"
            description="Get ATS score and improvement suggestions for your resume"
            link="/resume"
            gradient="from-lavender-50 to-primary-50"
          />
        </div>

        {/* Recent Activity */}
        {stats?.recentAnalyses && stats.recentAnalyses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-display font-bold mb-6">Recent Resume Analyses</h2>
            <div className="space-y-4">
              {stats.recentAnalyses.map((analysis) => (
                <Link
                  key={analysis._id}
                  to={`/resume`}
                  className="card card-hover p-6 block"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-2">{analysis.fileName}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        {analysis.atsScore}
                      </div>
                      <div className="text-sm text-gray-600">ATS Score</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

const StatCard = ({ icon, value, label, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card p-6"
    >
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  )
}

const ActionCard = ({ icon, title, description, link, gradient }) => {
  return (
    <Link to={link}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className={`card card-hover p-8 bg-gradient-to-br ${gradient}`}
      >
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-primary-600 font-medium">
          Get Started
          <ArrowRight size={18} className="ml-2" />
        </div>
      </motion.div>
    </Link>
  )
}

export default Dashboard
