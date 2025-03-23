"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { Card } from "@/components/ui/card";

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
    duration: 30,
    passingScore: 60,
    isMcqOnly: false,
    allowFileUpload: false,
    showAnswers: true,
    shuffleQuestions: true,
  });

  const filteredChapters = chapters.filter(
    (chapter) => chapter.subject_id === selectedSubject
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Quiz created successfully");
    router.push("/dashboard/teacher/quizzes");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
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
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quiz Configuration</h2>
        <div className="space-y-4">
          <div>
            <Label>Chapters</Label>
            <div className="space-y-2 mt-2">
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
            <Label htmlFor="difficulty">Difficulty Level</Label>
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

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: parseInt(e.target.value),
                })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="passingScore">Passing Score (%)</Label>
            <Input
              id="passingScore"
              type="number"
              min="0"
              max="100"
              value={formData.passingScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  passingScore: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quiz Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isMcqOnly"
              checked={formData.isMcqOnly}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  isMcqOnly: checked as boolean,
                })
              }
            />
            <Label htmlFor="isMcqOnly">MCQ Questions Only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowFileUpload"
              checked={formData.allowFileUpload}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  allowFileUpload: checked as boolean,
                })
              }
            />
            <Label htmlFor="allowFileUpload">Allow File Upload</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="showAnswers"
              checked={formData.showAnswers}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  showAnswers: checked as boolean,
                })
              }
            />
            <Label htmlFor="showAnswers">Show Answers After Submission</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shuffleQuestions"
              checked={formData.shuffleQuestions}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  shuffleQuestions: checked as boolean,
                })
              }
            />
            <Label htmlFor="shuffleQuestions">Shuffle Questions</Label>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/teacher/quizzes")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Quiz"}
        </Button>
      </div>
    </form>
  );
}