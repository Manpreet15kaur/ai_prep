import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-lavender-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-lavender-600 bg-clip-text text-transparent">
              PrepWise AI
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/generate" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Generate
            </Link>
            <Link to="/questions" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              My Questions
            </Link>
            <Link to="/resume" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Resume
            </Link>
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <User size={18} />
                <span className="font-medium">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
