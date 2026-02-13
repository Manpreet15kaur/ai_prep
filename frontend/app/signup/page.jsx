'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Sparkles, AlertCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { register } from '@/lib/auth'
import PasswordStrength from '@/components/PasswordStrength'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const data = await register(formData.name, formData.email, formData.password)
      
      if (data.success) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/40 via-pink/50 to-coral/40 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-electric-violet/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-coral-vibrant/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lavender/30 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.15)] border border-gray-200/50 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Illustration */}
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue/20 to-lavender/30 p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-coral-vibrant rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-electric-violet rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-coral-vibrant/20 to-electric-violet/20 rounded-full flex items-center justify-center">
                    <Sparkles className="text-electric-violet" size={80} />
                  </div>
                </motion.div>
                <h3 className="text-3xl font-display font-bold text-gray-800 mb-4">
                  Start Your Journey
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Join thousands preparing for their dream job with AI-powered practice
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 md:p-12 bg-white">
              <div className="mb-8">
                <Link href="/">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-coral-vibrant" size={28} />
                    <span className="text-xl font-display font-bold bg-gradient-to-r from-coral-vibrant to-electric-violet bg-clip-text text-transparent">
                      Interview Prep AI
                    </span>
                  </div>
                </Link>
                <p className="text-gray-500 text-sm mb-2">Get started today</p>
                <h2 className="text-4xl font-display font-bold text-gray-800">Create Account</h2>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-rose-red/10 border border-rose-red/20 rounded-xl flex items-center gap-2 text-rose-red"
                >
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-blue/10 border-0 focus:outline-none focus:ring-2 focus:ring-coral-vibrant/50 transition-all text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-blue/10 border-0 focus:outline-none focus:ring-2 focus:ring-coral-vibrant/50 transition-all text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-blue/10 border-0 focus:outline-none focus:ring-2 focus:ring-coral-vibrant/50 transition-all text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-coral-vibrant transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <PasswordStrength password={formData.password} />
                </div>

                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl gradient-vibrant text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500">Or continue with</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                
                <button 
                  type="button"
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-semibold text-gray-700 mb-6"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-coral-vibrant font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
