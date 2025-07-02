import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookOpen, Users, Clock, Edit, Trash2, Share2, Play, Star, TrendingUp, Award, Eye, EyeOff, Calendar, Zap, Target, Crown } from 'lucide-react'
import { useCourses } from '../context/CourseContext'
import { useAuth } from '../context/AuthContext'
import CreateCourseModal from '../components/CreateCourseModal'
import ShareModal from '../components/ShareModal'

const Dashboard = () => {
  const { user } = useAuth()
  const { courses, deleteCourse, publishCourse, unpublishCourse, loading } = useCourses()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [shareModalCourse, setShareModalCourse] = useState(null)

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId)
      } catch (error) {
        console.error('Error deleting course:', error)
        alert('Error deleting course: ' + error.message)
      }
    }
  }

  const handleTogglePublish = async (course) => {
    try {
      if (course.is_published) {
        await unpublishCourse(course.id)
      } else {
        await publishCourse(course.id)
      }
    } catch (error) {
      console.error('Error updating course:', error)
      alert('Error updating course: ' + error.message)
    }
  }

  const getTotalChapters = (course) => {
    if (!course || !course.sections) return 0
    return course.sections.reduce((total, section) => {
      return total + (section.chapters ? section.chapters.length : 0)
    }, 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'N/A'
    }
  }

  const getRandomRating = () => (4.2 + Math.random() * 0.6).toFixed(1)
  const getRandomStudents = () => Math.floor(Math.random() * 1000) + 100

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="hero-section">
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Ensure we have user and courses array
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in to access your dashboard</h2>
        </div>
      </div>
    )
  }

  // Ensure courses is an array
  const coursesList = Array.isArray(courses) ? courses : []

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white rounded-3xl p-12 shadow-2xl animate-fade-in-up">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-green-300 fill-current" />
                  <Star className="h-5 w-5 text-green-300 fill-current" />
                  <Star className="h-5 w-5 text-green-300 fill-current" />
                  <Star className="h-5 w-5 text-green-300 fill-current" />
                  <Star className="h-5 w-5 text-green-300 fill-current" />
                </div>
                <span className="text-white/90 text-sm font-medium">Premium Course Builder</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Welcome back,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Creator'}
                </span>
              </h1>
              <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                Build professional courses with our advanced platform. Engage students with interactive content and beautiful design.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Play className="h-12 w-12 text-white ml-1" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-900">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up animate-delay-200">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Courses</p>
              <p className="text-3xl font-bold text-slate-900">{coursesList.length}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Published</p>
              <p className="text-3xl font-bold text-slate-900">
                {coursesList.filter(course => course.is_published).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Sections</p>
              <p className="text-3xl font-bold text-slate-900">
                {coursesList.reduce((total, course) => total + (course.sections ? course.sections.length : 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Chapters</p>
              <p className="text-3xl font-bold text-slate-900">
                {coursesList.reduce((total, course) => total + getTotalChapters(course), 0)}
              </p>
            </div>
            <div className="p-3 bg-lime-50 rounded-xl">
              <Award className="h-6 w-6 text-lime-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between animate-fade-in-up animate-delay-300">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
          <p className="text-slate-600 mt-1">Manage and create your educational content</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Course</span>
        </button>
      </div>

      {coursesList.length === 0 ? (
        <div className="text-center py-16 animate-fade-in-up animate-delay-400">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to start teaching?</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Create your first course and start sharing your knowledge with the world. Our platform makes it easy to build engaging content.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Course</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up animate-delay-400">
          {coursesList.map((course, index) => (
            <div key={course.id} className={`group relative overflow-hidden card transition-all duration-500 hover:-translate-y-3 animate-fade-in-up animate-delay-${(index % 3 + 1) * 100}`}>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        course.is_published 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      }`}>
                        {course.is_published ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Draft
                          </>
                        )}
                      </span>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                        <Star className="h-3 w-3 text-yellow-600 fill-current" />
                        <span className="text-xs font-bold text-yellow-800">{getRandomRating()}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
                      {course.title || 'Untitled Course'}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {course.description || 'No description available'}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg mb-2 mx-auto">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Sections</p>
                    <p className="font-bold text-slate-900 text-lg">{course.sections ? course.sections.length : 0}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mb-2 mx-auto">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Chapters</p>
                    <p className="font-bold text-slate-900 text-lg">{getTotalChapters(course)}</p>
                  </div>
                  <div className="text-center p-3 bg-teal-50 rounded-xl border border-teal-100">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg mb-2 mx-auto">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Price</p>
                    <p className="font-bold text-slate-900 text-lg">
                      {course.price && course.price > 0 ? `$${course.price}` : 'Free'}
                    </p>
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Category:</span>
                    <span className="font-bold text-slate-900 bg-emerald-50 px-2 py-1 rounded-full text-xs border border-emerald-200">
                      {course.category || 'General'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Level:</span>
                    <span className="font-bold text-slate-900 bg-teal-50 px-2 py-1 rounded-full text-xs capitalize border border-teal-200">
                      {course.level || 'beginner'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Updated:</span>
                    <span className="font-medium text-slate-700 flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(course.updated_at)}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Primary Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/course/${course.id}/edit`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      to={`/course/${course.share_id}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Play className="h-4 w-4" />
                      <span>Preview</span>
                    </Link>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleTogglePublish(course)}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                        course.is_published
                          ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                      }`}
                    >
                      {course.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span>{course.is_published ? 'Unpublish' : 'Publish'}</span>
                    </button>
                    <button
                      onClick={() => setShareModalCourse(course)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="flex items-center justify-center px-3 py-2 text-sm font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <div className={`w-2 h-2 rounded-full ${course.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="font-medium">{course.is_published ? 'Live & Accessible' : 'Draft Mode'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateCourseModal onClose={() => setShowCreateModal(false)} />
      )}

      {shareModalCourse && (
        <ShareModal
          course={shareModalCourse}
          onClose={() => setShareModalCourse(null)}
        />
      )}
    </div>
  )
}

export default Dashboard
