import React from 'react'

const VideoPlayer = ({ videoUrl }) => {
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

  const isVimeoUrl = (url) => {
    return url.includes('vimeo.com')
  }

  const getVimeoEmbedUrl = (url) => {
    const videoId = url.split('vimeo.com/')[1].split('?')[0]
    return `https://player.vimeo.com/video/${videoId}`
  }

  if (isYouTubeUrl(videoUrl)) {
    return (
      <div className="aspect-video">
        <iframe
          src={getYouTubeEmbedUrl(videoUrl)}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allowFullScreen
          title="Course video"
        />
      </div>
    )
  }

  if (isVimeoUrl(videoUrl)) {
    return (
      <div className="aspect-video">
        <iframe
          src={getVimeoEmbedUrl(videoUrl)}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allowFullScreen
          title="Course video"
        />
      </div>
    )
  }

  // Direct video file
  return (
    <div className="aspect-video">
      <video
        src={videoUrl}
        className="w-full h-full rounded-lg"
        controls
        controlsList="nodownload"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer
