import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, BookOpen, Clock, User } from 'lucide-react'
import { useCourses } from '../context/CourseContext'
import VideoPlayer from '../components/VideoPlayer'

const CourseView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCourse } = useCourses()
  const [course, setCourse] = useState(null)
  const [currentChapter, setCurrentChapter] = useState(null)
  const [currentSectionId, setCurrentSectionId] = useState(null)

  useEffect(() => {
    const courseData = getCourse(id)
    if (!courseData) {
      navigate('/')
      return
    }
    setCourse(courseData)
    
    // Set first chapter as current if available
    if (courseData.sections.length > 0 && courseData.sections[0].chapters.length > 0) {
      setCurrentChapter(courseData.sections[0].chapters[0])
      setCurrentSectionId(courseData.sections[0].id)
    }
  }, [id, getCourse, navigate])

  const handleChapterSelect = (chapter, sectionId) => {
    setCurrentChapter(chapter)
    setCurrentSectionId(sectionId)
  }

  const getTotalChapters = () => {
    return course?.sections.reduce((total, section) => total + section.chapters.length, 0) || 0
  }

  if (!course) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
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
              {currentChapter.videoUrl && (
                <div className="card">
                  <VideoPlayer videoUrl={currentChapter.videoUrl} />
                </div>
              )}

              {/* Chapter Info */}
              <div className="card">
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
            <div className="card text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content available</h3>
              <p className="text-gray-600">This course doesn't have any chapters yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                {course.sections.length} sections
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
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
            <div className="space-y-4">
              {course.sections.map((section, sectionIndex) => (
                <div key={section.id}>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Section {sectionIndex + 1}: {section.title}
                  </h4>
                  <div className="space-y-1 ml-4">
                    {section.chapters.map((chapter, chapterIndex) => (
                      <button
                        key={chapter.id}
                        onClick={() => handleChapterSelect(chapter, section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentChapter?.id === chapter.id
                            ? 'bg-primary-100 text-primary-700 font-medium'
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
