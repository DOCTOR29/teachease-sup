"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Subject {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
  subject_id: string;
}

interface QuizFormProps {
  subjects: Subject[];
  chapters: Chapter[];
}

export function QuizForm({ subjects, chapters }: QuizFormProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    class: "",
    chapterIds: [] as string[],
    difficulty: "medium",
    questionCount: 10,
    isMcqOnly: false,
    allowFileUpload: false,
  });

  const filteredChapters = chapters.filter(
    (chapter) => chapter.subject_id === selectedSubject
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title: formData.title,
          subject_id: selectedSubject,
          difficulty: formData.difficulty,
          is_mcq_only: formData.isMcqOnly,
          total_questions: formData.questionCount
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // Create quiz blueprint
      const { error: blueprintError } = await supabase
        .from("quiz_blueprints")
        .insert({
          quiz_id: quiz.id,
          class: formData.class,
          subject_id: selectedSubject,
          chapter_ids: formData.chapterIds,
          difficulty: formData.difficulty,
          question_count: formData.questionCount,
          is_mcq_only: formData.isMcqOnly,
          allow_file_upload: formData.allowFileUpload
        });

      if (blueprintError) throw blueprintError;

      toast.success("Quiz created successfully");
      router.push("/dashboard/teacher/quizzes");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Quiz Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="class">Class</Label>
          <Input
            id="class"
            value={formData.class}
            onChange={(e) =>
              setFormData({ ...formData, class: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Chapters</Label>
          <div className="space-y-2">
            {filteredChapters.map((chapter) => (
              <div key={chapter.id} className="flex items-center space-x-2">
                <Checkbox
                  id={chapter.id}
                  checked={formData.chapterIds.includes(chapter.id)}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      chapterIds: checked
                        ? [...formData.chapterIds, chapter.id]
                        : formData.chapterIds.filter(
                            (id) => id !== chapter.id
                          ),
                    });
                  }}
                />
                <Label htmlFor={chapter.id}>{chapter.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) =>
              setFormData({ ...formData, difficulty: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="questionCount">Number of Questions</Label>
          <Input
            id="questionCount"
            type="number"
            min="1"
            max="100"
            value={formData.questionCount}
            onChange={(e) =>
              setFormData({
                ...formData,
                questionCount: parseInt(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="mcqOnly"
            checked={formData.isMcqOnly}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                isMcqOnly: checked as boolean,
              })
            }
          />
          <Label htmlFor="mcqOnly">MCQ Only</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="fileUpload"
            checked={formData.allowFileUpload}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                allowFileUpload: checked as boolean,
              })
            }
          />
          <Label htmlFor="fileUpload">Allow File Upload</Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Quiz"}
        Create Quiz
      </Button>
    </form>
  );
}