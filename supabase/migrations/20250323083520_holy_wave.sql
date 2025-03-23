/*
  # Question Papers Schema

  1. New Tables
    - question_papers
      - Store question paper configurations and metadata
    - question_paper_sections
      - Define sections within question papers
    - question_paper_questions
      - Map questions to sections with marks

  2. Security
    - Enable RLS
    - Add policies for teachers
*/

-- Question papers table
CREATE TABLE IF NOT EXISTS question_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  class TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) NOT NULL,
  chapter_ids UUID[] NOT NULL,
  difficulty difficulty_level NOT NULL,
  total_marks INTEGER NOT NULL CHECK (total_marks > 0),
  duration INTEGER NOT NULL CHECK (duration > 0),
  instructions TEXT,
  mcq_percentage INTEGER CHECK (mcq_percentage BETWEEN 0 AND 100),
  allow_partial_marking BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Question paper sections
CREATE TABLE IF NOT EXISTS question_paper_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_paper_id UUID REFERENCES question_papers(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  marks INTEGER NOT NULL CHECK (marks > 0),
  is_mcq BOOLEAN DEFAULT false,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Questions in sections
CREATE TABLE IF NOT EXISTS question_paper_questions (
  section_id UUID REFERENCES question_paper_sections(id) NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  marks INTEGER NOT NULL CHECK (marks > 0),
  order_number INTEGER NOT NULL,
  PRIMARY KEY (section_id, question_id)
);

-- Enable RLS
ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_paper_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_paper_questions ENABLE ROW LEVEL SECURITY;

-- Policies for question papers
CREATE POLICY "Teachers can manage question papers"
  ON question_papers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Policies for sections
CREATE POLICY "Teachers can manage question paper sections"
  ON question_paper_sections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Policies for questions in sections
CREATE POLICY "Teachers can manage question paper questions"
  ON question_paper_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Function to validate question paper creation
CREATE OR REPLACE FUNCTION validate_question_paper(
  p_total_marks INTEGER,
  p_mcq_percentage INTEGER,
  p_chapter_ids UUID[]
) RETURNS BOOLEAN AS $$
BEGIN
  -- Basic validation
  IF p_total_marks <= 0 THEN
    RAISE EXCEPTION 'Total marks must be greater than 0';
  END IF;

  IF p_mcq_percentage < 0 OR p_mcq_percentage > 100 THEN
    RAISE EXCEPTION 'MCQ percentage must be between 0 and 100';
  END IF;

  -- Verify chapters exist
  IF NOT EXISTS (
    SELECT 1 FROM chapters 
    WHERE id = ANY(p_chapter_ids)
  ) THEN
    RAISE EXCEPTION 'Invalid chapter selection';
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;