import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CourseProvider } from './context/CourseContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          <Header />
          <main>
            <Routes>
              {/* Public routes - redirect to dashboard if already logged in */}
              <Route path="/" element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } />
              
              {/* Public course sharing - always accessible */}
              <Route path="/public/:shareId" element={<PublicCourse />} />
              
              {/* Protected routes - only accessible when logged in */}
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

              {/* Catch all route - redirect to appropriate page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </CourseProvider>
    </AuthProvider>
  )
}

export default App
