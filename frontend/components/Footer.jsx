'use client'

import Link from 'next/link'
import { Sparkles, Github, Linkedin, Mail, Heart, BookOpen, Target, Award } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-auto">
      {/* Wavy Divider */}
      <div className="relative">
        <svg
          className="w-full h-24 sm:h-32"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="url(#gradient)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB5A7" />
              <stop offset="50%" stopColor="#FCD5CE" />
              <stop offset="100%" stopColor="#E8B4F9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Footer Content */}
      <div className="bg-gradient-to-r from-peach via-cream to-lavender">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <Link href="/dashboard">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-coral" size={28} />
                  <span className="text-xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                    Interview Prep AI
                  </span>
                </div>
              </Link>
              <p className="text-gray-700 text-sm mb-4">
                Master your interviews with AI-powered practice and personalized feedback.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-gray-700 hover:text-coral transition shadow-sm"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-gray-700 hover:text-coral transition shadow-sm"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="mailto:support@interviewprep.ai"
                  className="w-10 h-10 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-gray-700 hover:text-coral transition shadow-sm"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target size={18} className="text-coral" />
                Platform
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/dashboard" className="text-gray-700 hover:text-coral transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/vault" className="text-gray-700 hover:text-coral transition">
                    My Vault
                  </Link>
                </li>
                <li>
                  <Link href="/resume" className="text-gray-700 hover:text-coral transition">
                    Resume Analyzer
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-700 hover:text-coral transition">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-coral" />
                Resources
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-700 hover:text-coral transition">
                    Interview Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-coral transition">
                    Study Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-coral transition">
                    Career Advice
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-coral transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={18} className="text-coral" />
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-700 hover:text-coral transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-coral transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-coral transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-coral transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-700">
              © {currentYear} Interview Prep AI. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-gray-700">
              Made with <Heart size={14} className="text-coral fill-coral animate-pulse" /> for aspiring developers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
