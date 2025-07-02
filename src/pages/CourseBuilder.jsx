import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Save, ArrowLeft, Play } from 'lucide-react'
import { useCourses } from '../context/CourseContext'
import SectionModal from '../components/SectionModal'
import ChapterModal from '../components/ChapterModal'

const CourseBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCourse, updateCourse, deleteSection, deleteChapter } = useCourses()
  const [course, setCourse] = useState(null)
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [showChapterModal, setShowChapterModal] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [editingChapter, setEditingChapter] = useState(null)
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!id) {
          setError('Course ID is required')
          return
        }

        const courseData = getCourse(id)
        if (!courseData) {
          setError('Course not found')
          return
        }
        
        setCourse(courseData)
      } catch (err) {
        console.error('Error loading course:', err)
        setError('Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [id, getCourse])

  const handleSaveBasicInfo = async (updates) => {
    try {
      await updateCourse(id, updates)
      setCourse(prev => ({ ...prev, ...updates }))
    } catch (error) {
      console.error('Error updating course:', error)
      setError('Failed to update course')
    }
  }

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section and all its chapters?')) {
      try {
        await deleteSection(id, sectionId)
        setCourse(prev => ({
          ...prev,
          sections: prev.sections.filter(s => s.id !== sectionId)
        }))
      } catch (error) {
        console.error('Error deleting section:', error)
        setError('Failed to delete section')
      }
    }
  }

  const handleDeleteChapter = async (sectionId, chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        await deleteChapter(id, sectionId, chapterId)
        setCourse(prev => ({
          ...prev,
          sections: prev.sections.map(section =>
            section.id === sectionId
              ? { ...section, chapters: section.chapters.filter(c => c.id !== chapterId) }
              : section
          )
        }))
      } catch (error) {
        console.error('Error deleting chapter:', error)
        setError('Failed to delete chapter')
      }
    }
  }

  const handleAddSection = () => {
    setEditingSection(null)
    setShowSectionModal(true)
  }

  const handleEditSection = (section) => {
    setEditingSection(section)
    setShowSectionModal(true)
  }

  const handleAddChapter = (sectionId) => {
    setSelectedSectionId(sectionId)
    setEditingChapter(null)
    setShowChapterModal(true)
  }

  const handleEditChapter = (sectionId, chapter) => {
    setSelectedSectionId(sectionId)
    setEditingChapter(chapter)
    setShowChapterModal(true)
  }

  const refreshCourse = () => {
    const updatedCourse = getCourse(id)
    setCourse(updatedCourse)
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading course...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Course</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Course not found
  if (!course) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="text-slate-600 mb-6">The course you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Builder</h1>
            <p className="text-gray-600 mt-1">Build and organize your course content</p>
          </div>
        </div>
      </div>

      {/* Course Basic Info */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
        <CourseBasicInfo course={course} onSave={handleSaveBasicInfo} />
      </div>

      {/* Course Structure */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Course Structure</h2>
          <button
            onClick={handleAddSection}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </button>
        </div>

        {!course.sections || course.sections.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Play className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
            <p className="text-gray-600 mb-4">Start building your course by adding sections</p>
            <button
              onClick={handleAddSection}
              className="btn-primary"
            >
              Add Your First Section
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {course.sections.map((section, sectionIndex) => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Section {sectionIndex + 1}: {section.title}
                    </h3>
                    {section.description && (
                      <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddChapter(section.id)}
                      className="btn-secondary text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Chapter
                    </button>
                    <button
                      onClick={() => handleEditSection(section)}
                      className="text-primary-600 hover:text-primary-700 p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {!section.chapters || section.chapters.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm mb-2">No chapters in this section</p>
                    <button
                      onClick={() => handleAddChapter(section.id)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Add your first chapter
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {section.chapters.map((chapter, chapterIndex) => (
                      <div key={chapter.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              Chapter {chapterIndex + 1}: {chapter.title}
                            </h4>
                            {chapter.description && (
                              <p className="text-gray-600 text-sm mt-1">{chapter.description}</p>
                            )}
                            {chapter.video_url && (
                              <p className="text-primary-600 text-sm mt-1">
                                📹 Video: {chapter.video_url}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditChapter(section.id, chapter)}
                              className="text-primary-600 hover:text-primary-700 p-1"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteChapter(section.id, chapter.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showSectionModal && (
        <SectionModal
          courseId={id}
          section={editingSection}
          onClose={() => setShowSectionModal(false)}
          onSuccess={refreshCourse}
        />
      )}

      {showChapterModal && (
        <ChapterModal
          courseId={id}
          sectionId={selectedSectionId}
          chapter={editingChapter}
          onClose={() => setShowChapterModal(false)}
          onSuccess={refreshCourse}
        />
      )}
    </div>
  )
}

const CourseBasicInfo = ({ course, onSave }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category || '',
    level: course?.level || 'beginner'
  })
  const [isEditing, setIsEditing] = useState(false)

  // Update form data when course changes
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        level: course.level || 'beginner'
      })
    }
  }, [course])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSave(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving course info:', error)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!course) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
        <p className="text-gray-600">{course.description}</p>
        <div className="flex space-x-4 text-sm text-gray-500">
          <span>Category: {course.category}</span>
          <span>Level: {course.level}</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea"
          rows="3"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="input"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  )
}

export default CourseBuilder
