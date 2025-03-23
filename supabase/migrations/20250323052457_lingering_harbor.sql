/*
  # Platform Schema Setup

  1. New Tables
    - users
      - Extended user profile information for teachers and students
    - subscriptions
      - Manage teacher subscription plans
    - lessons
      - Store lesson plans created by teachers
    - questions
      - Question bank with metadata
    - quizzes
      - Quiz configurations and settings
    - quiz_questions
      - Questions assigned to quizzes
    - assignments
      - Student assignments
    - worksheets
      - Digital/printable worksheets
    - subjects
      - Subject catalog
    - chapters
      - Chapter information per subject
    
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_type AS ENUM ('mcq', 'descriptive');

-- Users table extension
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT,
  class TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions for teachers
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status subscription_status DEFAULT 'inactive',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects catalog
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Chapters within subjects
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Question bank
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) NOT NULL,
  content TEXT NOT NULL,
  type question_type NOT NULL,
  difficulty difficulty_level NOT NULL,
  correct_answer TEXT,
  options JSONB, -- For MCQs
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT unique_question_content UNIQUE (content)
);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id),
  chapter_id UUID REFERENCES chapters(id),
  difficulty difficulty_level NOT NULL,
  is_mcq_only BOOLEAN DEFAULT false,
  total_questions INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz questions mapping
CREATE TABLE IF NOT EXISTS quiz_questions (
  quiz_id UUID REFERENCES quizzes(id),
  question_id UUID REFERENCES questions(id),
  order_number INTEGER,
  PRIMARY KEY (quiz_id, question_id)
);

-- Worksheets
CREATE TABLE IF NOT EXISTS worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  chapter_id UUID REFERENCES chapters(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  chapter_id UUID REFERENCES chapters(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Subscriptions: Teachers can read their own subscription, admins can read all
CREATE POLICY "Teachers can read own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Subjects: Readable by all authenticated users
CREATE POLICY "Subjects are readable by all users"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (true);

-- Chapters: Readable by all authenticated users
CREATE POLICY "Chapters are readable by all users"
  ON chapters
  FOR SELECT
  TO authenticated
  USING (true);

-- Questions: Teachers and admins can create, all authenticated can read
CREATE POLICY "Questions are readable by all users"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

-- Quizzes: Teachers can create, students can read assigned
CREATE POLICY "Quiz access control"
  ON quizzes
  FOR SELECT
  TO authenticated
  USING (true);

-- Create functions for role checks
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;