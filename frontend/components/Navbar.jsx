'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Sparkles, X, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '@/lib/auth'

export default function Navbar() {
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    logout()
    setShowLogoutModal(false)
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/vault', label: 'My Vault' },
    { href: '/resume', label: 'Resume Analyzer' },
    { href: '/profile', label: 'Profile' },
  ]

  return (
    <>
      <header className="glass border-b border-pink/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard">
              <div className="flex items-center gap-2">
                <Sparkles className="text-coral" size={24} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                  Interview Prep AI
                </h1>
              </div>
            </Link>
            
            <nav className="flex gap-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${
                    pathname === link.href
                      ? 'text-coral font-medium'
                      : 'text-gray-600 hover:text-coral'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal Container */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-24 px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-sm"
              >
                <div className="bg-white rounded-2xl p-6 shadow-2xl border border-pink/20 relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={18} />
                  </button>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-center mb-2">Logout?</h3>
                  <p className="text-gray-600 text-center text-sm mb-5">
                    You'll need to sign in again to access your account.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLogoutModal(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition shadow-soft text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
