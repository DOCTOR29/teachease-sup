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
import { Card } from "@/components/ui/card";
import { MultiSelect } from "@/components/custom/multi-select"; // Assumes you have a custom MultiSelect component
import { Upload } from "lucide-react";

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
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    blueprintFile: null as File | null,
  });

  const filteredChapters = chapters.filter(
    (chapter) => chapter.subject_id === selectedSubject
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, blueprintFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Lesson blueprint submitted successfully");
    router.push("/dashboard/teacher/lessons");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Upload Lesson Blueprint</h2>

        <div>
          <Label htmlFor="className">Class</Label>
          <Input
            id="className"
            placeholder="Enter class name"
            value={formData.className}
            onChange={(e) =>
              setFormData({ ...formData, className: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
          <Label htmlFor="chapters">Chapters</Label>
          <MultiSelect
            options={filteredChapters.map((chapter) => ({
              label: chapter.name,
              value: chapter.id,
            }))}
            selected={selectedChapters}
            onChange={setSelectedChapters}
            placeholder="Select one or more chapters"
          />
        </div>

        <div>
          <Label htmlFor="blueprint">Upload Blueprint (PDF or Image)</Label>
          <Input
            id="blueprint"
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Submit Blueprint"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
