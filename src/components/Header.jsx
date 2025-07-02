import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, Home, Sparkles, User, LogOut } from 'lucide-react'

const Header = () => {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const isPublicView = location.pathname.startsWith('/public/')
  const isHomePage = location.pathname === '/'

  const handleSignOut = async () => {
    await signOut()
  }

  if (isPublicView) {
    return (
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Course Viewer</h1>
                <p className="text-xs text-slate-500">Premium Learning Experience</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // Transparent header for home page with proper spacing
  const headerClass = isHomePage 
    ? "absolute top-12 left-0 right-0 z-30 bg-transparent" 
    : "sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20"

  const textColor = isHomePage ? "text-white" : "text-slate-900"
  const logoTextColor = isHomePage ? "text-white" : ""

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${logoTextColor || 'gradient-text'}`}>Course Builder</h1>
              <p className={`text-xs ${isHomePage ? 'text-green-100' : 'text-slate-500'}`}>Create Amazing Courses</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className={`nav-link flex items-center space-x-2 ${textColor} ${isHomePage ? 'hover:bg-white/10' : ''}`}>
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200/60">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">Pro</span>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-3 py-2 ${isHomePage ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-white/60 backdrop-blur-sm border-slate-200/60'} rounded-lg border`}>
                    <User className={`h-4 w-4 ${isHomePage ? 'text-white' : 'text-slate-600'}`} />
                    <span className={`text-sm font-medium ${isHomePage ? 'text-white' : 'text-slate-700'}`}>
                      {user.user_metadata?.first_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className={`p-2 ${isHomePage ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/60'} rounded-lg transition-all duration-200`}
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={`${isHomePage ? 'text-white hover:bg-white/10' : ''} btn-ghost`}
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className={`btn-primary ${isHomePage ? 'bg-white text-green-600 hover:bg-green-50' : ''}`}
                >
                  Get started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
