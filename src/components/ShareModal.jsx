import React, { useState } from 'react'
import { X, Copy, Share2, Check, ExternalLink } from 'lucide-react'

const ShareModal = ({ course, onClose }) => {
  const [copied, setCopied] = useState(false)
  
  const shareUrl = `${window.location.origin}/course/share/${course.share_id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenInNewTab = () => {
    window.open(shareUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Share2 className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Share Course</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-sm text-gray-600">
              {course.is_published 
                ? 'Share this public link with your students to give them access to your course.'
                : 'This course is currently unpublished. Publish it first to make it accessible via the share link.'
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Link
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="input pr-10 text-sm"
                />
                <button
                  onClick={handleOpenInNewTab}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <button
                onClick={handleCopy}
                className={`btn-secondary flex items-center space-x-2 transition-all duration-200 ${
                  copied ? 'bg-green-100 text-green-700 border-green-200' : ''
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {!course.is_published && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-800 text-xs font-bold">!</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Course Not Published</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Students won't be able to access this course until you publish it. Go to your dashboard and click "Publish" to make it live.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Share Options</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Send this link directly to students</p>
              <p>• Post on social media or your website</p>
              <p>• Include in email newsletters</p>
              <p>• Add to your course catalog</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareModal
