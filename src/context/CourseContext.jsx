import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CourseContext = createContext()

export const useCourses = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider')
  }
  return context
}

export const CourseProvider = ({ children }) => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch user's courses
  const fetchCourses = async () => {
    if (!user) {
      setCourses([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          sections (
            *,
            chapters (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [user])

  const createCourse = async (courseData) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          ...courseData,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw error
      
      const newCourse = { ...data, sections: [] }
      setCourses(prev => [newCourse, ...prev])
      return newCourse
    } catch (error) {
      console.error('Error creating course:', error)
      throw error
    }
  }

  const updateCourse = async (courseId, updates) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { data, error } = await supabase
        .from('courses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', courseId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, ...data } : course
      ))
      return data
    } catch (error) {
      console.error('Error updating course:', error)
      throw error
    }
  }

  const deleteCourse = async (courseId) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)
        .eq('user_id', user.id)

      if (error) throw error

      setCourses(prev => prev.filter(course => course.id !== courseId))
    } catch (error) {
      console.error('Error deleting course:', error)
      throw error
    }
  }

  const getCourse = (courseId) => {
    return courses.find(course => course.id === courseId)
  }

  const getCourseByShareId = async (shareId) => {
    try {
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
        .eq('is_published', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching course by share ID:', error)
      return null
    }
  }

  const addSection = async (courseId, sectionData) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      // Get the current max order_index for this course
      const { data: existingSections } = await supabase
        .from('sections')
        .select('order_index')
        .eq('course_id', courseId)
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingSections?.length > 0 
        ? (existingSections[0].order_index || 0) + 1 
        : 0

      const { data, error } = await supabase
        .from('sections')
        .insert([{
          ...sectionData,
          course_id: courseId,
          order_index: nextOrderIndex
        }])
        .select()
        .single()

      if (error) throw error

      const newSection = { ...data, chapters: [] }
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, sections: [...course.sections, newSection] }
          : course
      ))
      return newSection
    } catch (error) {
      console.error('Error adding section:', error)
      throw error
    }
  }

  const updateSection = async (courseId, sectionId, updates) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { data, error } = await supabase
        .from('sections')
        .update(updates)
        .eq('id', sectionId)
        .select()
        .single()

      if (error) throw error

      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              sections: course.sections.map(section =>
                section.id === sectionId ? { ...section, ...data } : section
              )
            }
          : course
      ))
      return data
    } catch (error) {
      console.error('Error updating section:', error)
      throw error
    }
  }

  const deleteSection = async (courseId, sectionId) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId)

      if (error) throw error

      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              sections: course.sections.filter(section => section.id !== sectionId)
            }
          : course
      ))
    } catch (error) {
      console.error('Error deleting section:', error)
      throw error
    }
  }

  const addChapter = async (courseId, sectionId, chapterData) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      // Get the current max order_index for this section
      const { data: existingChapters } = await supabase
        .from('chapters')
        .select('order_index')
        .eq('section_id', sectionId)
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingChapters?.length > 0 
        ? (existingChapters[0].order_index || 0) + 1 
        : 0

      const { data, error } = await supabase
        .from('chapters')
        .insert([{
          ...chapterData,
          section_id: sectionId,
          order_index: nextOrderIndex
        }])
        .select()
        .single()

      if (error) throw error

      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              sections: course.sections.map(section =>
                section.id === sectionId
                  ? { ...section, chapters: [...section.chapters, data] }
                  : section
              )
            }
          : course
      ))
      return data
    } catch (error) {
      console.error('Error adding chapter:', error)
      throw error
    }
  }

  const updateChapter = async (courseId, sectionId, chapterId, updates) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { data, error } = await supabase
        .from('chapters')
        .update(updates)
        .eq('id', chapterId)
        .select()
        .single()

      if (error) throw error

      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              sections: course.sections.map(section =>
                section.id === sectionId
                  ? {
                      ...section,
                      chapters: section.chapters.map(chapter =>
                        chapter.id === chapterId ? { ...chapter, ...data } : chapter
                      )
                    }
                  : section
              )
            }
          : course
      ))
      return data
    } catch (error) {
      console.error('Error updating chapter:', error)
      throw error
    }
  }

  const deleteChapter = async (courseId, sectionId, chapterId) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId)

      if (error) throw error

      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? {
              ...course,
              sections: course.sections.map(section =>
                section.id === sectionId
                  ? {
                      ...section,
                      chapters: section.chapters.filter(chapter => chapter.id !== chapterId)
                    }
                  : section
              )
            }
          : course
      ))
    } catch (error) {
      console.error('Error deleting chapter:', error)
      throw error
    }
  }

  const publishCourse = async (courseId) => {
    return updateCourse(courseId, { is_published: true })
  }

  const unpublishCourse = async (courseId) => {
    return updateCourse(courseId, { is_published: false })
  }

  // Student enrollment functions
  const enrollInCourse = async (courseId) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([{
          user_id: user.id,
          course_id: courseId
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error enrolling in course:', error)
      throw error
    }
  }

  const getEnrollments = async () => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            *,
            sections (
              *,
              chapters (*)
            )
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching enrollments:', error)
      return []
    }
  }

  const updateChapterProgress = async (chapterId, watchTime, completed = false) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const progressData = {
        user_id: user.id,
        chapter_id: chapterId,
        watch_time: watchTime
      }

      if (completed) {
        progressData.completed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('chapter_progress')
        .upsert(progressData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating chapter progress:', error)
      throw error
    }
  }

  const getChapterProgress = async (chapterId) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('chapter_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching chapter progress:', error)
      return null
    }
  }

  const addCourseReview = async (courseId, rating, review) => {
    if (!user) throw new Error('User must be authenticated')

    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          rating,
          review
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding course review:', error)
      throw error
    }
  }

  const getCourseReviews = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching course reviews:', error)
      return []
    }
  }

  const value = {
    courses,
    loading,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    getCourseByShareId,
    addSection,
    updateSection,
    deleteSection,
    addChapter,
    updateChapter,
    deleteChapter,
    publishCourse,
    unpublishCourse,
    enrollInCourse,
    getEnrollments,
    updateChapterProgress,
    getChapterProgress,
    addCourseReview,
    getCourseReviews,
    refreshCourses: fetchCourses
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}
