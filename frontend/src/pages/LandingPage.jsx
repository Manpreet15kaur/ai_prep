import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Target, TrendingUp, BookOpen, ArrowRight } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-8"
            >
              <Sparkles className="text-primary-600" size={20} />
              <span className="text-sm font-medium text-gray-700">AI-Powered Interview Prep</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary-600 via-lavender-600 to-primary-600 bg-clip-text text-transparent">
                Ace Your Interviews
              </span>
              <br />
              <span className="text-gray-800">with PrepWise AI</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Generate personalized interview questions, analyze your resume with ATS scoring, 
              and track your preparation progress—all powered by AI.
            </p>

            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-600 text-lg">Comprehensive tools for interview preparation</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="text-primary-600" size={32} />}
              title="AI Question Generator"
              description="Generate role-specific interview questions based on topic, experience level, and question type"
            />
            <FeatureCard
              icon={<TrendingUp className="text-lavender-600" size={32} />}
              title="ATS Resume Analyzer"
              description="Get instant ATS scores, identify missing skills, and receive actionable improvement suggestions"
            />
            <FeatureCard
              icon={<BookOpen className="text-primary-600" size={32} />}
              title="Track Your Progress"
              description="Save questions, manage your preparation, and monitor your interview readiness"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-12"
          >
            <h2 className="text-4xl font-display font-bold mb-4">Ready to Start?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Join PrepWise AI today and take your interview preparation to the next level
            </p>
            <Link to="/signup">
              <button className="btn-primary text-lg">
                Create Free Account
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="card card-hover p-8"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

export default LandingPage
