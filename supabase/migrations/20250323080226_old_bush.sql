/*
  # Add Lessons Schema

  1. New Tables
    - lessons
      - Store lesson plans created by teachers
      - Include metadata like objectives, materials, duration
      - Link to subjects and chapters

  2. Security
    - Enable RLS
    - Add policies for teachers
*/

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  objectives TEXT,
  materials TEXT,
  duration INTEGER CHECK (duration > 0),
  chapter_id UUID REFERENCES chapters(id) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Policies for lessons
CREATE POLICY "Teachers can manage lessons"
  ON lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Students can view lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'student'
    )
  );