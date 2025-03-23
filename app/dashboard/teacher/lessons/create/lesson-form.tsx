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
        .from("lessons")
        .insert({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          chapter_id: formData.chapterId,
          objectives: formData.objectives,
          materials: formData.materials,
          duration: formData.duration
        });

      if (error) throw error;

      toast.success("Lesson plan created successfully");
      router.push("/dashboard/teacher/lessons");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create lesson plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Label htmlFor="description">Brief Description</Label>
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
        <Label htmlFor="objectives">Learning Objectives</Label>
        <Textarea
          id="objectives"
          value={formData.objectives}
          onChange={(e) =>
            setFormData({ ...formData, objectives: e.target.value })
          }
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
        <Label htmlFor="content">Lesson Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="min-h-[200px]"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Lesson Plan"}
      </Button>
    </form>
  );
}