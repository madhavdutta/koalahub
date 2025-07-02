import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CourseProvider } from './context/CourseContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CourseBuilder from './pages/CourseBuilder'
import CourseView from './pages/CourseView'
import PublicCourse from './pages/PublicCourse'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/public/:shareId" element={<PublicCourse />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/course/:id/edit" element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <CourseBuilder />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/course/:id" element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <CourseView />
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </CourseProvider>
    </AuthProvider>
  )
}

export default App
