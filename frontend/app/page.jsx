'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      // If logged in, redirect to dashboard
      router.push('/dashboard')
    } else {
      // If not logged in, redirect to login
      router.push('/login')
    }
  }, [router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-peach/20 to-lavender/30 flex items-center justify-center">
      <div className="text-center">
        <Sparkles className="text-coral mx-auto mb-4 animate-pulse" size={48} />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
