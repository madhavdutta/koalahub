import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Play, BookOpen, Clock, User, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import VideoPlayer from '../components/VideoPlayer'

const PublicCourse = () => {
  const { shareId } = useParams()
  const [course, setCourse] = useState(null)
  const [currentChapter, setCurrentChapter] = useState(null)
  const [currentSectionId, setCurrentSectionId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!shareId) return
      
      setLoading(true)
      try {
        console.log('Fetching course with shareId:', shareId)
        
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            sections (
              *,
              chapters (*)
            )
          `)
          .eq('share_id', shareId)
          .single()

        if (error) {
          console.error('Error fetching course:', error)
          setCourse(null)
          return
        }

        console.log('Course data:', data)
        setCourse(data)
        
        // Set first chapter as current if available
        if (data?.sections?.length > 0 && data.sections[0].chapters?.length > 0) {
          setCurrentChapter(data.sections[0].chapters[0])
          setCurrentSectionId(data.sections[0].id)
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [shareId])

  const handleChapterSelect = (chapter, sectionId) => {
    setCurrentChapter(chapter)
    setCurrentSectionId(sectionId)
    setSidebarOpen(false)
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
          <p className="text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
          <p className="text-sm text-gray-500 mt-2">Share ID: {shareId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{course.title}</h1>
            <p className="text-sm text-gray-600">{course.category} • {course.level}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <BookOpen className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:block`}>
          
          {/* Course Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
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
                {course.level}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                {course.category}
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6 overflow-y-auto h-full">
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
                          {chapterIndex + 1}. {chapter.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {currentChapter ? (
            <div className="p-6 space-y-6">
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
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {course.title}</h3>
                <p className="text-gray-600 mb-6">{course.description}</p>
                {course.sections?.length > 0 && course.sections[0].chapters?.length > 0 && (
                  <button
                    onClick={() => handleChapterSelect(course.sections[0].chapters[0], course.sections[0].id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Learning
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicCourse
