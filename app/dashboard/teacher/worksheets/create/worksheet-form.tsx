"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MultiSelect } from "@/components/custom/multi-select";

interface Subject {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
  subject_id: string;
}

interface WorksheetFormProps {
  subjects: Subject[];
  chapters: Chapter[];
}

export function WorksheetForm({ subjects, chapters }: WorksheetFormProps) {
  const router = useRouter();

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
  
    class: "",
    difficulty: "medium",
    chapterIds: [] as string[],
    blueprint: null as File | null,
  });

  const filteredChapters = chapters.filter(
    (chapter) => chapter.subject_id === selectedSubject
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
  
    formPayload.append("class", formData.class);
    formPayload.append("difficulty", formData.difficulty);
    formData.chapterIds.forEach((id) => formPayload.append("chapterIds", id));
    if (formData.blueprint) {
      formPayload.append("blueprint", formData.blueprint);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Question paper created successfully");
    router.push("/dashboard/teacher/questions");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Question Paper Info</h2>

        <div className="space-y-4">
          

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
              onValueChange={(value) => {
                setSelectedSubject(value);
                setFormData({ ...formData, chapterIds: [] }); // Reset selected chapters
              }}
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
            <Label>Chapters</Label>
            <MultiSelect
              options={filteredChapters.map((chapter) => ({
                label: chapter.name,
                value: chapter.id,
              }))}
              selected={formData.chapterIds}
              onChange={(selectedIds) =>
                setFormData({ ...formData, chapterIds: selectedIds })
              }
              placeholder="Select chapters"
            />
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
              required
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/teacher/questions")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
