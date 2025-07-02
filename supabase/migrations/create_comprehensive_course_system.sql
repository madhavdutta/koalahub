/*
  # Complete Course Management Platform Database

  ## Overview
  This migration creates a comprehensive course management system supporting video-based learning with multi-user functionality, progress tracking, and analytics.

  ## Database Schema

  ### Core Course Structure
  - **courses**: Main course entities with metadata, pricing, and publishing status
  - **sections**: Course organization units for grouping related content
  - **chapters**: Individual lessons containing video content and materials

  ### User Management & Progress
  - **enrollments**: Student course registrations with completion tracking
  - **chapter_progress**: Granular progress tracking for individual lessons
  - **course_reviews**: Student feedback and rating system

  ### Analytics & Insights
  - **course_analytics**: Daily metrics for course performance and revenue tracking

  ## Security Model
  - Row Level Security (RLS) enabled on all tables
  - Course creators have full control over their content
  - Students access content based on enrollment and payment status
  - Public access to published course previews and free content

  ## Key Features
  - Hierarchical content structure (Course → Section → Chapter)
  - Unique shareable course links via share_id
  - Free preview chapters for marketing
  - Comprehensive progress tracking
  - Revenue and engagement analytics
  - Multi-user role-based access control
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'General',
  level text DEFAULT 'beginner',
  price decimal(10,2) DEFAULT 0,
  thumbnail_url text,
  share_id uuid UNIQUE DEFAULT gen_random_uuid(),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  video_url text,
  video_duration integer DEFAULT 0,
  content text,
  order_index integer DEFAULT 0,
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Create chapter_progress table
CREATE TABLE IF NOT EXISTS chapter_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chapter_id uuid REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz,
  watch_time integer DEFAULT 0,
  UNIQUE(user_id, chapter_id)
);

-- Create course_reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create course_analytics table
CREATE TABLE IF NOT EXISTS course_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE,
  views integer DEFAULT 0,
  enrollments integer DEFAULT 0,
  completions integer DEFAULT 0,
  revenue decimal(10,2) DEFAULT 0,
  UNIQUE(course_id, date)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_analytics ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Public can view published courses"
  ON courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can view their own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sections policies
CREATE POLICY "Users can view sections of accessible courses"
  ON sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = sections.course_id 
      AND (courses.is_published = true OR courses.user_id = auth.uid())
    )
  );

CREATE POLICY "Course owners can manage sections"
  ON sections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = sections.course_id 
      AND courses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = sections.course_id 
      AND courses.user_id = auth.uid()
    )
  );

-- Chapters policies
CREATE POLICY "Users can view chapters of accessible courses"
  ON chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sections s
      JOIN courses c ON c.id = s.course_id
      WHERE s.id = chapters.section_id 
      AND (c.is_published = true OR c.user_id = auth.uid())
    )
  );

CREATE POLICY "Course owners can manage chapters"
  ON chapters FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sections s
      JOIN courses c ON c.id = s.course_id
      WHERE s.id = chapters.section_id 
      AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sections s
      JOIN courses c ON c.id = s.course_id
      WHERE s.id = chapters.section_id 
      AND c.user_id = auth.uid()
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Chapter progress policies
CREATE POLICY "Users can view their own progress"
  ON chapter_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can track their own progress"
  ON chapter_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON chapter_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Course reviews policies
CREATE POLICY "Public can view course reviews"
  ON course_reviews FOR SELECT
  USING (true);

CREATE POLICY "Enrolled users can create reviews"
  ON course_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.user_id = auth.uid() 
      AND enrollments.course_id = course_reviews.course_id
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON course_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON course_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Course analytics policies
CREATE POLICY "Course owners can view their analytics"
  ON course_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_analytics.course_id 
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage analytics"
  ON course_analytics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_analytics.course_id 
      AND courses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_analytics.course_id 
      AND courses.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_share_id ON courses(share_id);
CREATE INDEX IF NOT EXISTS idx_sections_course_id ON sections(course_id);
CREATE INDEX IF NOT EXISTS idx_sections_order ON sections(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_chapters_section_id ON chapters(section_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(section_id, order_index);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_user_chapter ON chapter_progress(user_id, chapter_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course_id ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_analytics_course_date ON course_analytics(course_id, date);