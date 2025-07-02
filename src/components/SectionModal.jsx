import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useCourses } from '../context/CourseContext'

const SectionModal = ({ courseId, section, onClose, onSuccess }) => {
  const { addSection, updateSection } = useCourses()
  const [formData, setFormData] = useState({
    title: section?.title || '',
    description: section?.description || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (section) {
      updateSection(courseId, section.id, formData)
    } else {
      addSection(courseId, formData)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {section ? 'Edit Section' : 'Add New Section'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Enter section title"
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
              rows="3"
              placeholder="Describe what this section covers"
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
              {section ? 'Update Section' : 'Add Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SectionModal
