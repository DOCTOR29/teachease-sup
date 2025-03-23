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
import { Textarea } from "@/components/ui/textarea";
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

interface LessonFormProps {
  subjects: Subject[];
  chapters: Chapter[];
}

export function LessonForm({ subjects, chapters }: LessonFormProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    chapterId: "",
    objectives: "",
    materials: "",
    duration: 60,
    activities: "",
    assessment: "",
    homework: "",
  });

  const filteredChapters = chapters.filter(
    (chapter) => chapter.subject_id === selectedSubject
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Lesson plan created successfully");
    router.push("/dashboard/teacher/lessons");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Lesson Title</Label>
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
            <Label htmlFor="chapter">Chapter</Label>
            <Select
              value={formData.chapterId}
              onValueChange={(value) =>
                setFormData({ ...formData, chapterId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {filteredChapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Lesson Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="objectives">Learning Objectives</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) =>
                setFormData({ ...formData, objectives: e.target.value })
              }
              placeholder="What will students learn?"
              required
            />
          </div>

          <div>
            <Label htmlFor="materials">Required Materials</Label>
            <Textarea
              id="materials"
              value={formData.materials}
              onChange={(e) =>
                setFormData({ ...formData, materials: e.target.value })
              }
              placeholder="List all required materials"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Lesson Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Main lesson content and teaching points"
              className="min-h-[200px]"
              required
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Activities & Assessment</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="activities">Class Activities</Label>
            <Textarea
              id="activities"
              value={formData.activities}
              onChange={(e) =>
                setFormData({ ...formData, activities: e.target.value })
              }
              placeholder="Describe class activities and exercises"
              required
            />
          </div>

          <div>
            <Label htmlFor="assessment">Assessment Method</Label>
            <Textarea
              id="assessment"
              value={formData.assessment}
              onChange={(e) =>
                setFormData({ ...formData, assessment: e.target.value })
              }
              placeholder="How will you assess student understanding?"
              required
            />
          </div>

          <div>
            <Label htmlFor="homework">Homework/Assignment</Label>
            <Textarea
              id="homework"
              value={formData.homework}
              onChange={(e) =>
                setFormData({ ...formData, homework: e.target.value })
              }
              placeholder="Optional homework or follow-up assignment"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/teacher/lessons")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Lesson Plan"}
        </Button>
      </div>
    </form>
  );
}