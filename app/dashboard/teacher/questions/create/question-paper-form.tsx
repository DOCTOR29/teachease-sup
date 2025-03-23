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
import { Textarea } from "@/components/ui/textarea";

interface Subject {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
  subject_id: string;
}

interface QuestionPaperFormProps {
  subjects: Subject[];
  chapters: Chapter[];
}

export function QuestionPaperForm({ subjects, chapters }: QuestionPaperFormProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    class: "",
    chapterIds: [] as string[],
    difficulty: "medium",
    totalMarks: 100,
    duration: 180,
    instructions: "",
    mcqPercentage: 40,
    allowPartialMarking: true,
  });

  const filteredChapters = chapters.filter(
    (chapter) => chapter.subject_id === selectedSubject
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      const { error } = await supabase
        .from("question_papers")
        .insert({
          title: formData.title,
          description: formData.description,
          class: formData.class,
          subject_id: selectedSubject,
          chapter_ids: formData.chapterIds,
          difficulty: formData.difficulty,
          total_marks: formData.totalMarks,
          duration: formData.duration,
          instructions: formData.instructions,
          mcq_percentage: formData.mcqPercentage,
          allow_partial_marking: formData.allowPartialMarking
        });

      if (error) throw error;

      toast.success("Question paper created successfully");
      router.push("/dashboard/teacher/questions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create question paper");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Paper Title</Label>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
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
        <Label htmlFor="totalMarks">Total Marks</Label>
        <Input
          id="totalMarks"
          type="number"
          min="1"
          value={formData.totalMarks}
          onChange={(e) =>
            setFormData({
              ...formData,
              totalMarks: parseInt(e.target.value),
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
        <Label htmlFor="mcqPercentage">MCQ Percentage</Label>
        <Input
          id="mcqPercentage"
          type="number"
          min="0"
          max="100"
          value={formData.mcqPercentage}
          onChange={(e) =>
            setFormData({
              ...formData,
              mcqPercentage: parseInt(e.target.value),
            })
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) =>
            setFormData({ ...formData, instructions: e.target.value })
          }
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="allowPartialMarking"
          checked={formData.allowPartialMarking}
          onCheckedChange={(checked) =>
            setFormData({
              ...formData,
              allowPartialMarking: checked as boolean,
            })
          }
        />
        <Label htmlFor="allowPartialMarking">Allow Partial Marking</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Question Paper"}
      </Button>
    </form>
  );
}