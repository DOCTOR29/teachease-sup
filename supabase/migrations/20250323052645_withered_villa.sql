/*
  # Add Quiz Validation Schema

  1. New Tables
    - quiz_blueprints
      - Store quiz configuration and validation rules
    - quiz_attempts
      - Track student quiz attempts and responses

  2. Changes
    - Add blueprint_id to quizzes table
    - Add validation constraints

  3. Security
    - Enable RLS
    - Add policies for teachers and students
*/

-- Quiz blueprints for validation
CREATE TABLE IF NOT EXISTS quiz_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  class TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) NOT NULL,
  chapter_ids UUID[] NOT NULL,
  difficulty difficulty_level NOT NULL,
  question_count INTEGER NOT NULL CHECK (question_count > 0),
  is_mcq_only BOOLEAN DEFAULT false,
  allow_file_upload BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT valid_question_count CHECK (question_count <= 100)
);

-- Quiz attempts tracking
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  answers JSONB,
  uploaded_file_url TEXT,
  score INTEGER,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE quiz_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for quiz_blueprints
CREATE POLICY "Teachers can create quiz blueprints"
  ON quiz_blueprints
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Users can view quiz blueprints"
  ON quiz_blueprints
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for quiz_attempts
CREATE POLICY "Students can create and view own attempts"
  ON quiz_attempts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to validate quiz creation
CREATE OR REPLACE FUNCTION validate_quiz_creation(
  p_class TEXT,
  p_subject_id UUID,
  p_chapter_ids UUID[],
  p_difficulty difficulty_level,
  p_question_count INTEGER,
  p_is_mcq_only BOOLEAN
) RETURNS BOOLEAN AS $$
BEGIN
  -- Basic validation
  IF p_question_count <= 0 OR p_question_count > 100 THEN
    RAISE EXCEPTION 'Invalid question count';
  END IF;

  -- Verify chapters belong to subject
  IF NOT EXISTS (
    SELECT 1 FROM chapters 
    WHERE id = ANY(p_chapter_ids) 
    AND subject_id = p_subject_id
  ) THEN
    RAISE EXCEPTION 'Invalid chapter selection';
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;