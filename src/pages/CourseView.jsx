import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, BookOpen, Clock, User, ChevronRight } from 'lucide-react'
import { useCourses } from '../context/CourseContext'
import VideoPlayer from '../components/VideoPlayer'

const CourseView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCourseById } = useCourses()
  const [course, setCourse] = useState(null)
  const [currentChapter, setCurrentChapter] = useState(null)
  const [currentSectionId, setCurrentSectionId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const courseData = await getCourseById(id)
        if (!courseData) {
          navigate('/dashboard')
          return
        }
        setCourse(courseData)
        
        // Set first chapter as current if available
        if (courseData.sections?.length > 0 && courseData.sections[0].chapters?.length > 0) {
          setCurrentChapter(courseData.sections[0].chapters[0])
          setCurrentSectionId(courseData.sections[0].id)
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id, getCourseById, navigate])

  const handleChapterSelect = (chapter, sectionId) => {
    setCurrentChapter(chapter)
    setCurrentSectionId(sectionId)
  }

  const getTotalChapters = () => {
    return course?.sections?.reduce((total, section) => total + (section.chapters?.length || 0), 0) || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2 inline" />
          Back to Dashboard
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-1">{course.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentChapter ? (
            <div className="space-y-6">
              {/* Video Player */}
              {currentChapter.video_url && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <VideoPlayer videoUrl={currentChapter.video_url} />
                </div>
              )}

              {/* Chapter Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentChapter.title}
                </h2>
                {currentChapter.description && (
                  <p className="text-gray-600 mb-4">{currentChapter.description}</p>
                )}
                {currentChapter.content && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {currentChapter.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12 px-6">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content available</h3>
              <p className="text-gray-600">This course doesn't have any chapters yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                {course.sections?.length || 0} sections
              </div>
              <div className="flex items-center text-gray-600">
                <Play className="h-4 w-4 mr-2" />
                {getTotalChapters()} chapters
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {course.level} level
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {course.category}
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
            <div className="space-y-4">
              {course.sections?.map((section, sectionIndex) => (
                <div key={section.id}>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Section {sectionIndex + 1}: {section.title}
                  </h4>
                  <div className="space-y-1 ml-6">
                    {section.chapters?.map((chapter, chapterIndex) => (
                      <button
                        key={chapter.id}
                        onClick={() => handleChapterSelect(chapter, section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentChapter?.id === chapter.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <Play className="h-3 w-3 mr-2" />
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseView
