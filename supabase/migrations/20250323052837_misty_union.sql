/*
  # Quiz Attempt System

  1. New Tables
    - quiz_results
      - Store final quiz results and grades
    - quiz_feedback
      - Store teacher feedback on attempts

  2. Changes
    - Add grading fields to quiz_attempts
    - Add feedback support

  3. Security
    - Enable RLS
    - Add policies for teachers and students
*/

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID REFERENCES quiz_attempts(id) NOT NULL,
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage DECIMAL NOT NULL,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz feedback table
CREATE TABLE IF NOT EXISTS quiz_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID REFERENCES quiz_attempts(id) NOT NULL,
  feedback TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for quiz_results
CREATE POLICY "Students can view own results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_results.quiz_attempt_id
      AND quiz_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage results"
  ON quiz_results
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Policies for quiz_feedback
CREATE POLICY "Students can view own feedback"
  ON quiz_feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_feedback.quiz_attempt_id
      AND quiz_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage feedback"
  ON quiz_feedback
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Function to calculate quiz score
CREATE OR REPLACE FUNCTION calculate_quiz_score(
  p_attempt_id UUID,
  p_answers JSONB,
  p_correct_answers JSONB
) RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_question_id TEXT;
  v_student_answer TEXT;
  v_correct_answer TEXT;
BEGIN
  FOR v_question_id, v_student_answer IN SELECT * FROM jsonb_each_text(p_answers)
  LOOP
    v_correct_answer := p_correct_answers->v_question_id;
    IF v_student_answer = v_correct_answer THEN
      v_score := v_score + 1;
    END IF;
  END LOOP;
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;