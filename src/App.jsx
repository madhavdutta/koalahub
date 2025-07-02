import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CourseProvider } from './context/CourseContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CourseBuilder from './pages/CourseBuilder'
import PublicCourse from './pages/PublicCourse'

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main className="pt-16 px-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/course/:id/edit" 
                element={
                  <ProtectedRoute>
                    <CourseBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route path="/course/:shareId" element={<PublicCourse />} />
            </Routes>
          </main>
        </div>
      </CourseProvider>
    </AuthProvider>
  )
}

export default App
