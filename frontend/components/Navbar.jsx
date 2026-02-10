'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Sparkles } from 'lucide-react'
import { logout } from '@/lib/auth'

export default function Navbar() {
  const pathname = usePathname()

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/vault', label: 'My Vault' },
    { href: '/resume', label: 'Resume Analyzer' },
    { href: '/profile', label: 'Profile' },
  ]

  return (
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
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
