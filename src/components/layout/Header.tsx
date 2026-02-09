import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface HeaderProps {
  activeTab?: string
}

export default function Header({ activeTab }: HeaderProps) {
  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Vault', href: '/vault' },
    { label: 'Resume Analyzer', href: '/resume' },
    { label: 'Profile', href: '/profile' }
  ]

  return (
    <header className="glass border-b border-pink/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Sparkles className="text-coral" size={24} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-coral to-purple bg-clip-text text-transparent">
                Interview Prep AI
              </h1>
            </div>
          </Link>
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`transition ${
                  activeTab === item.href 
                    ? 'text-coral font-medium' 
                    : 'text-gray-600 hover:text-coral'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
