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

interface AssignmentFormProps {
  subjects: Subject[];
  chapters: Chapter[];
}

export function AssignmentForm({ subjects, chapters }: AssignmentFormProps) {
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
    blueprint: null as File | null,
    prompt: "",
  });

  const filteredChapters = chapters.filter(
    (chapter) => chapter.subject_id === selectedSubject
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("class", formData.class);
    formPayload.append("difficulty", formData.difficulty);
    formPayload.append("questionCount", formData.questionCount.toString());
    formPayload.append("duration", formData.duration.toString());
    formPayload.append("passingScore", formData.passingScore.toString());
    formPayload.append("isMcqOnly", formData.isMcqOnly.toString());
    formPayload.append("allowFileUpload", formData.allowFileUpload.toString());
    formPayload.append("showAnswers", formData.showAnswers.toString());
    formPayload.append("shuffleQuestions", formData.shuffleQuestions.toString());
    formPayload.append("prompt", formData.prompt);
    formData.chapterIds.forEach((id) => formPayload.append("chapterIds", id));
    if (formData.blueprint) {
      formPayload.append("blueprint", formData.blueprint);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
            <Label htmlFor="blueprint">Blueprint (PDF/Image)</Label>
            <Input
              id="blueprint"
              type="file"
              accept=".pdf,image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  blueprint: e.target.files?.[0] || null,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="prompt">Prompt / Notes (Optional)</Label>
            <Input
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Enter instructions, notes, or prompts"
            />
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
          {[
            { key: "isMcqOnly", label: "MCQ Questions Only" },
            { key: "allowFileUpload", label: "Allow File Upload" },
            { key: "showAnswers", label: "Show Answers After Submission" },
            { key: "shuffleQuestions", label: "Shuffle Questions" },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center space-x-2">
              <Checkbox
                id={setting.key}
                checked={(formData as any)[setting.key]}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    [setting.key]: checked as boolean,
                  }))
                }
              />
              <Label htmlFor={setting.key}>{setting.label}</Label>
            </div>
          ))}
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
