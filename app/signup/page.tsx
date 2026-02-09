'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, User, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-peach/20 to-lavender/30 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-coral" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                Interview Prep AI
              </span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-600">Start your interview prep journey today</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-pink/20 card-glow">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Sarah Johnson"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-pink/10 focus:outline-none focus:border-coral transition-all"
                />
              </div>
            </div>

            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full py-3 rounded-xl gradient-pastel text-white font-semibold shadow-soft hover:shadow-glow transition-all"
              >
                Create Account
              </motion.button>
            </Link>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-coral font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
