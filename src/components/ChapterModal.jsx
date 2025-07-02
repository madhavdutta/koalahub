import React, { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { useCourses } from '../context/CourseContext'

const ChapterModal = ({ courseId, sectionId, chapter, onClose, onSuccess }) => {
  const { addChapter, updateChapter } = useCourses()
  const [formData, setFormData] = useState({
    title: chapter?.title || '',
    description: chapter?.description || '',
    videoUrl: chapter?.videoUrl || '',
    content: chapter?.content || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (chapter) {
      updateChapter(courseId, sectionId, chapter.id, formData)
    } else {
      addChapter(courseId, sectionId, formData)
    }
    
    onSuccess()
    onClose()
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const getYouTubeEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {chapter ? 'Edit Chapter' : 'Add New Chapter'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chapter Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Enter chapter title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea"
              rows="2"
              placeholder="Brief description of this chapter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://youtube.com/watch?v=... or direct video URL"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supports YouTube URLs, Vimeo, or direct video file URLs
            </p>
            
            {formData.videoUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Video Preview:</p>
                <div className="bg-gray-100 rounded-lg p-4">
                  {isYouTubeUrl(formData.videoUrl) ? (
                    <div className="aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(formData.videoUrl)}
                        className="w-full h-full rounded"
                        frameBorder="0"
                        allowFullScreen
                        title="Video preview"
                      />
                    </div>
                  ) : (
                    <video
                      src={formData.videoUrl}
                      className="w-full max-h-48 rounded"
                      controls
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                  )}
                  <div className="hidden text-center py-8 text-gray-500">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p>Unable to load video preview</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chapter Content (Optional)
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="textarea"
              rows="6"
              placeholder="Add any additional text content, notes, or resources for this chapter..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {chapter ? 'Update Chapter' : 'Add Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChapterModal
